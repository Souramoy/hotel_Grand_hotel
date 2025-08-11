import React, { useState, useEffect } from 'react';
import { Users, UtensilsCrossed, ImageIcon, LogOut, Edit, Plus, Trash2 } from 'lucide-react';
import RoomForm from '../../components/admin/RoomForm';
import MenuForm from '../../components/admin/MenuForm';
import GalleryForm from '../../components/admin/GalleryForm';

interface Room {
  id: number;
  category: string;
  name: string;
  description: string;
  price: number;
  available: number;
  total: number;
  images: string[];
  videos?: string[];
  amenities: string[];
}
interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
}
interface Menu {
  breakfast: MenuItem[];
  lunch: MenuItem[];
  dinner: MenuItem[];
  snacks: MenuItem[];
}
interface GalleryItem {
  id: number;
  type: 'image' | 'video';
  category: string;
  url: string;
  caption: string;
}
interface DashboardProps {
  onLogout: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState<string>('rooms');
  const [rooms, setRooms] = useState<Room[]>([]);
  const [menu, setMenu] = useState<Menu | null>(null);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  
  // Form state
  const [showRoomForm, setShowRoomForm] = useState(false);
  const [showMenuForm, setShowMenuForm] = useState(false);
  const [showGalleryForm, setShowGalleryForm] = useState(false);
  const [editingRoom, setEditingRoom] = useState<Room | undefined>(undefined);
  const [editingMenuItem, setEditingMenuItem] = useState<MenuItem | undefined>(undefined);
  const [editingMenuCategory, setEditingMenuCategory] = useState<string>('breakfast');
  const [editingGalleryItem, setEditingGalleryItem] = useState<GalleryItem | undefined>(undefined);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [roomsRes, menuRes, galleryRes] = await Promise.all([
          fetch('http://localhost:5000/api/rooms'),
          fetch('http://localhost:5000/api/menu'),
          fetch('http://localhost:5000/api/gallery'),
        ]);
        const roomsData = await roomsRes.json();
        const menuData = await menuRes.json();
        const galleryData = await galleryRes.json();
        setRooms(roomsData.rooms);
        setMenu(menuData.menu);
        setGallery(galleryData.gallery.map((item: any) => ({ ...item, type: item.type as 'image' | 'video' })));
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const updateMenu = async (newMenu: Menu) => {
    setMenu(newMenu);
    try {
      await fetch('http://localhost:5000/api/menu', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ menu: newMenu }),
      });
      } catch (error) {
        console.error('Failed to update menu:', error);
      }
    };

    const updateGallery = async (newGallery: GalleryItem[]) => {
      const fixedGallery = newGallery.map(item => ({ ...item, type: item.type as 'image' | 'video' }));
      setGallery(fixedGallery);
      try {
        await fetch('http://localhost:5000/api/gallery', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ gallery: fixedGallery }),
        });
      } catch (error) {
        console.error('Failed to update gallery:', error);
      }
    };

    const updateRoomAvailability = async (roomId: number, newAvailable: number) => {
    const updatedRooms = rooms.map(room =>
      room.id === roomId ? { ...room, available: newAvailable } : room
    );
    setRooms(updatedRooms);
    try {
      await fetch('http://localhost:5000/api/rooms', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rooms: updatedRooms }),
      });
    } catch (error) {
      console.error('Failed to update room:', error);
    }
  };
  
  const handleSaveRoom = async (room: Room) => {
    let updatedRooms;
    const isNewRoom = !rooms.some(r => r.id === room.id);
    
    if (isNewRoom) {
      updatedRooms = [...rooms, room];
      try {
        await fetch('http://localhost:5000/api/rooms', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(room),
        });
      } catch (error) {
        console.error('Failed to add room:', error);
      }
    } else {
      updatedRooms = rooms.map(r => r.id === room.id ? room : r);
      try {
        await fetch('http://localhost:5000/api/rooms', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ rooms: updatedRooms }),
        });
      } catch (error) {
        console.error('Failed to update room:', error);
      }
    }
    
    setRooms(updatedRooms);
    setShowRoomForm(false);
    setEditingRoom(undefined);
  };
  
  const handleEditRoom = (room: Room) => {
    setEditingRoom(room);
    setShowRoomForm(true);
  };
  
  const handleSaveMenuItem = async (item: MenuItem, category: string) => {
    if (!menu) return;
    
    const isNewItem = !Object.values(menu).flat().some((i: any) => i.id === item.id);
    const oldCategory = editingMenuCategory;
    const newCategory = category;
    
    const updatedMenu = { ...menu };
    
    if (isNewItem) {
      // Add new item
      // @ts-ignore
      updatedMenu[newCategory] = [...updatedMenu[newCategory], item];
      try {
        await fetch(`http://localhost:5000/api/menu/${newCategory}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(item),
        });
      } catch (error) {
        console.error('Failed to add menu item:', error);
      }
    } else if (oldCategory !== newCategory) {
      // Move item to new category
      // @ts-ignore
      updatedMenu[oldCategory] = updatedMenu[oldCategory].filter((i: MenuItem) => i.id !== item.id);
      // @ts-ignore
      updatedMenu[newCategory] = [...updatedMenu[newCategory], item];
    } else {
      // Update existing item
      // @ts-ignore
      updatedMenu[category] = updatedMenu[category].map((i: MenuItem) => 
        i.id === item.id ? item : i
      );
    }
    
    updateMenu(updatedMenu as Menu);
    setShowMenuForm(false);
    setEditingMenuItem(undefined);
  };
  
  const handleEditMenuItem = (item: MenuItem, category: string) => {
    setEditingMenuItem(item);
    setEditingMenuCategory(category);
    setShowMenuForm(true);
  };
  
  const handleSaveGalleryItem = async (item: GalleryItem) => {
    const isNewItem = !gallery.some(i => i.id === item.id);
    let updatedGallery;
    
    if (isNewItem) {
      updatedGallery = [...gallery, item];
      try {
        await fetch('http://localhost:5000/api/gallery', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(item),
        });
      } catch (error) {
        console.error('Failed to add gallery item:', error);
      }
    } else {
      updatedGallery = gallery.map(i => i.id === item.id ? item : i);
    }
    
    updateGallery(updatedGallery);
    setShowGalleryForm(false);
    setEditingGalleryItem(undefined);
  };
  
  const handleEditGalleryItem = (item: GalleryItem) => {
    setEditingGalleryItem(item);
    setShowGalleryForm(true);
  };

    const tabs = [
      { id: 'rooms', name: 'Rooms', icon: Users },
      { id: 'menu', name: 'Menu', icon: UtensilsCrossed },
      { id: 'gallery', name: 'Gallery', icon: ImageIcon },
    ];

    if (loading) {
      return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-yellow-600"></div>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-gray-100">
        {/* Header */}
        <div className="bg-white shadow-lg">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <h1 className="text-2xl font-bold text-gray-900">Hotel Admin Dashboard</h1>
              <button
                onClick={onLogout}
                className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Tabs */}
          <div className="mb-8">
            <nav className="flex space-x-8">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 py-2 px-4 border-b-2 font-medium text-sm ${
                      activeTab === tab.id
                        ? 'border-yellow-600 text-yellow-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    {tab.name}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Content */}
          {activeTab === 'rooms' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold text-gray-900">Room Management</h2>
                <button
                  className="flex items-center gap-2 bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
                  onClick={() => {
                    setEditingRoom(undefined);
                    setShowRoomForm(true);
                  }}
                >
                  <Plus className="h-4 w-4" />
                  Add New Room
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {rooms.map((room) => (
                  <div key={room.id} className="bg-white rounded-lg shadow-lg p-6">
                    {room.videos && room.videos.length > 0 ? (
                      <video 
                        src={room.videos[0]} 
                        className="w-full h-48 object-cover rounded-lg mb-4"
                        controls
                        muted
                      />
                    ) : (
                      <img 
                        src={room.images[0]} 
                        alt={room.name}
                        className="w-full h-48 object-cover rounded-lg mb-4"
                      />
                    )}
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{room.name}</h3>
                    <p className="text-gray-600 mb-4">{room.description}</p>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="font-semibold">Price:</span>
                        <span>{room.price} INR/night</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-semibold">Total Rooms:</span>
                        <span>{room.total}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="font-semibold">Available:</span>
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            min="0"
                            max={room.total}
                            value={room.available}
                            onChange={(e) => updateRoomAvailability(room.id, parseInt(e.target.value))}
                            className="w-16 px-2 py-1 border border-gray-300 rounded text-center"
                          />
                          <span className="text-gray-500">/ {room.total}</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center mt-4">
                        <span className="font-semibold">Features:</span>
                        <button
                          className="text-blue-600 hover:text-blue-800"
                          onClick={() => handleEditRoom(room)}
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {room.amenities.map((amenity, index) => (
                          <span key={index} className="text-xs bg-gray-100 px-2 py-1 rounded-full">
                            {amenity}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {showRoomForm && (
                <RoomForm
                  isOpen={showRoomForm}
                  onClose={() => {
                    setShowRoomForm(false);
                    setEditingRoom(undefined);
                  }}
                  onSave={handleSaveRoom}
                  room={editingRoom}
                  isEditing={!!editingRoom}
                />
              )}
            </div>
          )}

          {activeTab === 'menu' && menu && (
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-gray-900">Menu Management</h2>
              {Object.entries(menu).map(([category, items]) => (
                <div key={category} className="bg-white rounded-lg shadow-lg p-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4 capitalize">
                    {category}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {(items as MenuItem[]).map((item) => (
                      <div key={item.id} className="border border-gray-200 rounded-lg p-4">
                        <img 
                          src={item.image} 
                          alt={item.name}
                          className="w-full h-32 object-cover rounded-lg mb-3"
                        />
                        <h4 className="font-bold text-gray-900 mb-1">{item.name}</h4>
                        <p className="text-gray-600 text-sm mb-2">{item.description}</p>
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-yellow-600">{item.price} INR</span>
                          <div className="flex gap-2">
                            <button 
                              className="p-1 text-blue-600 hover:bg-blue-50 rounded" 
                              onClick={() => handleEditMenuItem(item, category)}
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button className="p-1 text-red-600 hover:bg-red-50 rounded" onClick={() => {
                              // Delete menu item
                              const updatedMenu = { ...menu };
                              // @ts-ignore
                              updatedMenu[category] = (items as MenuItem[]).filter((i) => i.id !== item.id);
                              updateMenu(updatedMenu as Menu);
                            }}>
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <button
                    className="mt-4 flex items-center gap-2 bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
                    onClick={() => {
                      setEditingMenuItem(undefined);
                      setEditingMenuCategory(category);
                      setShowMenuForm(true);
                    }}
                  >
                    <Plus className="h-4 w-4" />
                    Add New Item
                  </button>
                </div>
              ))}
              
              {showMenuForm && (
                <MenuForm
                  isOpen={showMenuForm}
                  onClose={() => {
                    setShowMenuForm(false);
                    setEditingMenuItem(undefined);
                  }}
                  onSave={handleSaveMenuItem}
                  item={editingMenuItem}
                  category={editingMenuCategory}
                  isEditing={!!editingMenuItem}
                />
              )}
            </div>
          )}

          {activeTab === 'gallery' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold text-gray-900">Gallery Management</h2>
                <button 
                  className="flex items-center gap-2 bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg transition-colors duration-200" 
                  onClick={() => {
                    setEditingGalleryItem(undefined);
                    setShowGalleryForm(true);
                  }}
                >
                  <Plus className="h-4 w-4" />
                  Add New Item
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {gallery.map((item) => (
                  <div key={item.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
                    {item.type === 'image' ? (
                      <img 
                        src={item.url} 
                        alt={item.caption}
                        className="w-full h-48 object-cover"
                      />
                    ) : (
                      <video 
                        src={item.url}
                        className="w-full h-48 object-cover"
                        controls
                      />
                    )}
                    <div className="p-4">
                      <h4 className="font-semibold text-gray-900 mb-1">{item.caption}</h4>
                      <p className="text-gray-600 text-sm mb-3 capitalize">{item.category}</p>
                      <div className="flex justify-between">
                        <button 
                          className="text-blue-600 hover:bg-blue-50 p-1 rounded" 
                          onClick={() => handleEditGalleryItem(item)}
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button className="text-red-600 hover:bg-red-50 p-1 rounded" onClick={() => {
                          // Delete gallery item
                          const newGallery = gallery.filter(i => i.id !== item.id);
                          updateGallery(newGallery);
                        }}>
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {showGalleryForm && (
                <GalleryForm
                  isOpen={showGalleryForm}
                  onClose={() => {
                    setShowGalleryForm(false);
                    setEditingGalleryItem(undefined);
                  }}
                  onSave={handleSaveGalleryItem}
                  item={editingGalleryItem}
                  isEditing={!!editingGalleryItem}
                />
              )}
            </div>
          )}
        </div>
      </div>
    );
  };


export default Dashboard;