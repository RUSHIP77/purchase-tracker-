import React, { useState, useEffect, useRef } from 'react';
import * as XLSX from 'xlsx';

export default function App() {
  const [people, setPeople] = useState(() => {
    const saved = localStorage.getItem('purchaseTrackerData');
    if (saved) {
      return JSON.parse(saved);
    }
    return [
      {
        id: 1,
        name: 'Sarah',
        expanded: true,
        products: [
          { id: 1, name: 'Laptop Stand', price: 45, links: ['https://amazon.com/...'] },
          { id: 2, name: 'USB Hub', price: 29, links: [] },
        ]
      }
    ];
  });

  const [editingPerson, setEditingPerson] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);
  const [newPersonName, setNewPersonName] = useState('');
  const [showAddPerson, setShowAddPerson] = useState(false);
  const [addingProductFor, setAddingProductFor] = useState(null);
  const [newProductName, setNewProductName] = useState('');
  const [deleteModal, setDeleteModal] = useState({ show: false, personId: null, personName: '' });
  const [exportModal, setExportModal] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const newProductInputRef = useRef(null);

  // Save to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem('purchaseTrackerData', JSON.stringify(people));
  }, [people]);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (mobileMenuOpen && !event.target.closest('.mobile-menu-container')) {
        setMobileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [mobileMenuOpen]);

  const togglePerson = (id) => {
    setPeople(people.map(p => 
      p.id === id ? { ...p, expanded: !p.expanded } : p
    ));
  };

  const calculateTotal = () => {
    return people.reduce((total, person) => {
      return total + person.products.reduce((sum, product) => sum + product.price * 1.1, 0);
    }, 0);
  };

  const getPersonTotal = (person) => {
    return person.products.reduce((sum, product) => sum + product.price * 1.1, 0);
  };

  // PERSON CRUD
  const addPerson = () => {
    if (!newPersonName.trim()) return;
    const newPerson = {
      id: Date.now(),
      name: newPersonName.trim(),
      expanded: true,
      products: []
    };
    setPeople([...people, newPerson]);
    setNewPersonName('');
    setShowAddPerson(false);
  };

  const showDeleteModal = (personId, personName) => {
    setDeleteModal({ show: true, personId, personName });
  };

  const confirmDelete = () => {
    setPeople(people.filter(p => p.id !== deleteModal.personId));
    setDeleteModal({ show: false, personId: null, personName: '' });
  };

  const cancelDelete = () => {
    setDeleteModal({ show: false, personId: null, personName: '' });
  };

  const updatePersonName = (personId, newName) => {
    setPeople(people.map(p => 
      p.id === personId ? { ...p, name: newName } : p
    ));
    setEditingPerson(null);
  };

  // PRODUCT CRUD
  const startAddingProduct = (personId) => {
    setAddingProductFor(personId);
    setNewProductName('');
    // Expand the person section
    setPeople(people.map(p => 
      p.id === personId ? { ...p, expanded: true } : p
    ));
    // Focus input after render
    setTimeout(() => {
      if (newProductInputRef.current) {
        newProductInputRef.current.focus();
      }
    }, 50);
  };

  const confirmAddProduct = (personId) => {
    if (!newProductName.trim()) {
      setAddingProductFor(null);
      return;
    }
    const newProduct = {
      id: Date.now(),
      name: newProductName.trim(),
      price: 0,
      links: []
    };
    setPeople(people.map(p => 
      p.id === personId 
        ? { ...p, products: [...p.products, newProduct] }
        : p
    ));
    setAddingProductFor(null);
    setNewProductName('');
  };

  const cancelAddProduct = () => {
    setAddingProductFor(null);
    setNewProductName('');
  };

  const deleteProduct = (personId, productId) => {
    setPeople(people.map(p => 
      p.id === personId 
        ? { ...p, products: p.products.filter(prod => prod.id !== productId) }
        : p
    ));
  };

  const updateProduct = (personId, productId, field, value) => {
    setPeople(people.map(p => 
      p.id === personId 
        ? { 
            ...p, 
            products: p.products.map(prod => 
              prod.id === productId 
                ? { ...prod, [field]: field === 'price' ? parseFloat(value) || 0 : value }
                : prod
            )
          }
        : p
    ));
  };

  // LINK MANAGEMENT
  const addLink = (personId, productId) => {
    const link = prompt('Enter link URL:');
    if (link && link.trim()) {
      setPeople(people.map(p => 
        p.id === personId 
          ? { 
              ...p, 
              products: p.products.map(prod => 
                prod.id === productId 
                  ? { ...prod, links: [...prod.links, link.trim()] }
                  : prod
              )
            }
          : p
      ));
    }
  };

  const deleteLink = (personId, productId, linkIndex) => {
    setPeople(people.map(p => 
      p.id === personId 
        ? { 
            ...p, 
            products: p.products.map(prod => 
              prod.id === productId 
                ? { ...prod, links: prod.links.filter((_, i) => i !== linkIndex) }
                : prod
            )
          }
        : p
    ));
  };

  const updateLink = (personId, productId, linkIndex, newLink) => {
    setPeople(people.map(p => 
      p.id === personId 
        ? { 
            ...p, 
            products: p.products.map(prod => 
              prod.id === productId 
                ? { 
                    ...prod, 
                    links: prod.links.map((link, i) => i === linkIndex ? newLink : link) 
                  }
                : prod
            )
          }
        : p
    ));
  };

  // EXCEL EXPORT
  const exportAllToExcel = () => {
    const data = [];
    
    people.forEach(person => {
      data.push({
        'Name': person.name,
        'Product': '',
        'Price': '',
        'With Tax (10%)': '',
        'Links': ''
      });
      
      person.products.forEach(product => {
        data.push({
          'Name': '',
          'Product': product.name,
          'Price': product.price.toFixed(2),
          'With Tax (10%)': (product.price * 1.1).toFixed(2),
          'Links': product.links.join(' | ')
        });
      });
      
      data.push({
        'Name': '',
        'Product': 'Subtotal',
        'Price': '',
        'With Tax (10%)': getPersonTotal(person).toFixed(2),
        'Links': ''
      });
      
      data.push({
        'Name': '',
        'Product': '',
        'Price': '',
        'With Tax (10%)': '',
        'Links': ''
      });
    });
    
    data.push({
      'Name': 'GRAND TOTAL',
      'Product': '',
      'Price': '',
      'With Tax (10%)': calculateTotal().toFixed(2),
      'Links': ''
    });

    const ws = XLSX.utils.json_to_sheet(data);
    
    ws['!cols'] = [
      { wch: 15 },
      { wch: 25 },
      { wch: 10 },
      { wch: 15 },
      { wch: 40 },
    ];
    
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'All Purchases');
    XLSX.writeFile(wb, 'purchase-tracker-all.xlsx');
    setExportModal(false);
    setMobileMenuOpen(false);
  };

  const exportPersonToExcel = (person) => {
    const data = [];
    
    data.push({
      'Product': `${person.name}'s Purchases`,
      'Price': '',
      'With Tax (10%)': '',
      'Links': ''
    });
    
    data.push({
      'Product': '',
      'Price': '',
      'With Tax (10%)': '',
      'Links': ''
    });
    
    data.push({
      'Product': 'Product',
      'Price': 'Price',
      'With Tax (10%)': 'With Tax (10%)',
      'Links': 'Links'
    });
    
    person.products.forEach(product => {
      data.push({
        'Product': product.name,
        'Price': product.price.toFixed(2),
        'With Tax (10%)': (product.price * 1.1).toFixed(2),
        'Links': product.links.join(' | ')
      });
    });
    
    data.push({
      'Product': '',
      'Price': '',
      'With Tax (10%)': '',
      'Links': ''
    });
    
    data.push({
      'Product': 'TOTAL',
      'Price': '',
      'With Tax (10%)': getPersonTotal(person).toFixed(2),
      'Links': ''
    });

    const ws = XLSX.utils.json_to_sheet(data, { skipHeader: true });
    
    ws['!cols'] = [
      { wch: 25 },
      { wch: 10 },
      { wch: 15 },
      { wch: 40 },
    ];
    
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, person.name);
    XLSX.writeFile(wb, `purchase-tracker-${person.name.toLowerCase()}.xlsx`);
    setExportModal(false);
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-start mb-2">
          <div className="flex-1 min-w-0">
            <h1 className="text-xl sm:text-2xl font-semibold text-black truncate">Purchase Tracker</h1>
          </div>
          
          {/* Desktop Actions */}
          <div className="hidden sm:flex items-center gap-3">
            {!showAddPerson && (
              <button
                onClick={() => setShowAddPerson(true)}
                className="w-10 h-10 sm:w-8 sm:h-8 flex items-center justify-center border border-gray-300 rounded-lg text-gray-500 hover:border-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-colors text-lg"
                title="Add Person"
              >
                +
              </button>
            )}
            <button
              onClick={() => setExportModal(true)}
              className="bg-gray-800 text-white px-3 sm:px-4 py-2 rounded-lg text-sm font-medium hover:bg-black transition-colors flex items-center gap-2"
            >
              <span>↓</span> <span className="hidden xs:inline">Export</span> Excel
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="sm:hidden mobile-menu-container relative">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded-lg text-gray-500 hover:border-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-colors"
              aria-label="Menu"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            
            {/* Mobile Dropdown Menu */}
            {mobileMenuOpen && (
              <div className="absolute right-0 top-12 bg-white border border-gray-200 rounded-lg shadow-lg py-2 w-48 z-50">
                <button
                  onClick={() => {
                    setShowAddPerson(true);
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-left px-4 py-3 text-gray-700 hover:bg-gray-50 flex items-center gap-3"
                >
                  <span className="text-lg">+</span>
                  Add Person
                </button>
                <button
                  onClick={() => {
                    setExportModal(true);
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-left px-4 py-3 text-gray-700 hover:bg-gray-50 flex items-center gap-3"
                >
                  <span>↓</span>
                  Export Excel
                </button>
              </div>
            )}
          </div>
        </div>
        <p className="text-xs sm:text-sm text-gray-400 mb-6 sm:mb-8">Track purchases for multiple people</p>
        
        {/* Total Banner */}
        <div className="bg-gray-800 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6 flex justify-between items-center shadow-md">
          <span className="text-gray-300 text-sm sm:text-base">Total Spending</span>
          <span className="text-xl sm:text-2xl font-semibold text-white">
            ${calculateTotal().toFixed(2)}
          </span>
        </div>

        {/* Add Person Input */}
        {showAddPerson && (
          <div className="mb-4 bg-white border border-gray-200 rounded-lg p-3 sm:p-4">
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                value={newPersonName}
                onChange={(e) => setNewPersonName(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addPerson()}
                placeholder="Enter person's name"
                className="flex-1 px-3 py-3 sm:py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-500 text-base"
                autoFocus
              />
              <div className="flex gap-2">
                <button
                  onClick={addPerson}
                  className="flex-1 sm:flex-none px-4 py-3 sm:py-2 bg-gray-800 text-white rounded-lg hover:bg-black transition-colors text-base sm:text-sm"
                >
                  Add
                </button>
                <button
                  onClick={() => { setShowAddPerson(false); setNewPersonName(''); }}
                  className="flex-1 sm:flex-none px-4 py-3 sm:py-2 bg-gray-200 text-gray-600 rounded-lg hover:bg-gray-300 transition-colors text-base sm:text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* People Sections */}
        <div className="space-y-3">
          {people.map(person => (
            <div key={person.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
              {/* Person Header */}
              <div className="px-3 sm:px-4 py-3 hover:bg-gray-50 group">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-1.5 sm:gap-3 flex-1 min-w-0">
                    <button
                      onClick={() => togglePerson(person.id)}
                      className={`text-gray-500 transform transition-transform flex-shrink-0 text-sm sm:text-base ${person.expanded ? 'rotate-90' : ''}`}
                    >
                      ›
                    </button>
                    
                    {editingPerson === person.id ? (
                      <input
                        type="text"
                        defaultValue={person.name}
                        onBlur={(e) => updatePersonName(person.id, e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && updatePersonName(person.id, e.target.value)}
                        className="font-semibold text-gray-900 border-b border-gray-400 focus:outline-none bg-transparent min-w-0 flex-1 text-sm sm:text-base"
                        autoFocus
                      />
                    ) : (
                      <span 
                        className="font-semibold text-gray-900 cursor-pointer hover:text-gray-700 truncate text-sm sm:text-base"
                        onClick={() => setEditingPerson(person.id)}
                        title="Click to edit name"
                      >
                        {person.name}
                      </span>
                    )}
                    
                    <span className="text-xs text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded-full flex-shrink-0 hidden xs:inline">
                      {person.products.length}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-1 sm:gap-3 flex-shrink-0">
                    {/* Trash icon - always visible on mobile as small icon */}
                    <button
                      onClick={() => showDeleteModal(person.id, person.name)}
                      className="text-gray-400 hover:text-red-500 p-1 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity"
                      title="Delete person"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 sm:h-4 sm:w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                    <span className="text-gray-700 font-semibold text-xs sm:text-base">${getPersonTotal(person).toFixed(2)}</span>
                    <button
                      onClick={() => startAddingProduct(person.id)}
                      className="w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center bg-gray-100 text-gray-500 rounded-full hover:bg-gray-200 hover:text-gray-700 transition-colors text-base sm:text-lg font-light flex-shrink-0"
                      title="Add product"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              {/* Products - Mobile Card View & Desktop Table View */}
              {person.expanded && (
                <div className="border-t border-gray-100">
                  {person.products.length === 0 && addingProductFor !== person.id ? (
                    <div className="py-4 text-center text-gray-400 text-sm">
                      No products yet
                    </div>
                  ) : (
                    <>
                      {/* Desktop Table View */}
                      <div className="hidden lg:block overflow-x-auto">
                        <table className="w-full table-fixed">
                          <thead className="bg-gray-50">
                            <tr className="text-xs text-gray-600 uppercase tracking-wider">
                              <th className="px-4 py-2 text-left font-semibold w-2/5">Product</th>
                              <th className="px-4 py-2 text-right font-semibold w-1/6">Price</th>
                              <th className="px-4 py-2 text-right font-semibold w-1/6">With Tax</th>
                              <th className="px-4 py-2 text-left font-semibold w-1/4">Links</th>
                              <th className="w-10"></th>
                            </tr>
                          </thead>
                          <tbody>
                            {person.products.map(product => (
                              <React.Fragment key={product.id}>
                              <tr className="border-t border-gray-50 group">
                                {/* Product Name */}
                                <td className="px-4 py-3 align-top">
                                  {editingProduct === `${person.id}-${product.id}-name` ? (
                                    <input
                                      type="text"
                                      defaultValue={product.name}
                                      onBlur={(e) => {
                                        updateProduct(person.id, product.id, 'name', e.target.value);
                                        setEditingProduct(null);
                                      }}
                                      onKeyPress={(e) => {
                                        if (e.key === 'Enter') {
                                          updateProduct(person.id, product.id, 'name', e.target.value);
                                          setEditingProduct(null);
                                        }
                                      }}
                                      className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:border-gray-500"
                                      autoFocus
                                    />
                                  ) : (
                                    <span 
                                      className="text-gray-700 font-medium cursor-pointer hover:text-gray-900"
                                      onClick={() => setEditingProduct(`${person.id}-${product.id}-name`)}
                                      title="Click to edit"
                                    >
                                      {product.name}
                                    </span>
                                  )}
                                </td>
                                
                                {/* Price */}
                                <td className="px-4 py-3 text-right align-top">
                                  {editingProduct === `${person.id}-${product.id}-price` ? (
                                    <input
                                      type="number"
                                      defaultValue={product.price}
                                      onBlur={(e) => {
                                        updateProduct(person.id, product.id, 'price', e.target.value);
                                        setEditingProduct(null);
                                      }}
                                      onKeyPress={(e) => {
                                        if (e.key === 'Enter') {
                                          updateProduct(person.id, product.id, 'price', e.target.value);
                                          setEditingProduct(null);
                                        }
                                      }}
                                      className="w-20 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:border-gray-500 text-right"
                                      autoFocus
                                    />
                                  ) : (
                                    <span 
                                      className="text-gray-400 cursor-pointer hover:text-gray-600"
                                      onClick={() => setEditingProduct(`${person.id}-${product.id}-price`)}
                                      title="Click to edit"
                                    >
                                      ${product.price.toFixed(2)}
                                    </span>
                                  )}
                                </td>
                                
                                {/* With Tax */}
                                <td className="px-4 py-3 text-right text-gray-600 font-medium align-top">
                                  ${(product.price * 1.1).toFixed(2)}
                                </td>
                                
                                {/* Links */}
                                <td className="px-4 py-3 align-top">
                                  <div className="group/links">
                                    {product.links.length > 0 ? (
                                      <div className="flex flex-col gap-1">
                                        {product.links.map((link, index) => (
                                          <div key={index} className="flex items-center gap-1 group/link">
                                            {editingProduct === `${person.id}-${product.id}-link-${index}` ? (
                                              <input
                                                type="text"
                                                defaultValue={link}
                                                onBlur={(e) => {
                                                  updateLink(person.id, product.id, index, e.target.value);
                                                  setEditingProduct(null);
                                                }}
                                                onKeyPress={(e) => {
                                                  if (e.key === 'Enter') {
                                                    updateLink(person.id, product.id, index, e.target.value);
                                                    setEditingProduct(null);
                                                  }
                                                }}
                                                className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:border-gray-500"
                                                autoFocus
                                              />
                                            ) : (
                                              <>
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-gray-800 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                                                </svg>
                                                <a 
                                                  href={link} 
                                                  target="_blank"
                                                  rel="noopener noreferrer"
                                                  className="text-gray-500 hover:text-gray-700 hover:underline text-sm truncate max-w-40"
                                                >
                                                  {link.replace(/^https?:\/\//, '').substring(0, 20)}{link.replace(/^https?:\/\//, '').length > 20 ? '...' : ''}
                                                </a>
                                                <button
                                                  onClick={() => setEditingProduct(`${person.id}-${product.id}-link-${index}`)}
                                                  className="text-gray-400 hover:text-gray-600 opacity-0 group-hover/link:opacity-100 text-xs"
                                                >
                                                  ✎
                                                </button>
                                                <button
                                                  onClick={() => deleteLink(person.id, product.id, index)}
                                                  className="text-gray-400 hover:text-red-500 opacity-0 group-hover/link:opacity-100 text-xs"
                                                >
                                                  ✕
                                                </button>
                                              </>
                                            )}
                                          </div>
                                        ))}
                                      </div>
                                    ) : null}
                                    <button
                                      onClick={() => addLink(person.id, product.id)}
                                      className="text-gray-400 hover:text-gray-600 opacity-0 group-hover/links:opacity-100 transition-opacity mt-1"
                                      title="Add link"
                                    >
                                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                      </svg>
                                    </button>
                                  </div>
                                </td>
                                
                                {/* Delete */}
                                <td className="px-4 py-3 text-right align-top">
                                  <button
                                    onClick={() => deleteProduct(person.id, product.id)}
                                    className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-red-500"
                                    title="Delete product"
                                  >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                  </button>
                                </td>
                              </tr>
                              </React.Fragment>
                            ))}
                            
                            {/* New Product Input Row - Desktop */}
                            {addingProductFor === person.id && (
                              <tr className="border-t border-gray-50 bg-gray-50">
                                <td className="px-4 py-3">
                                  <input
                                    ref={newProductInputRef}
                                    type="text"
                                    value={newProductName}
                                    onChange={(e) => setNewProductName(e.target.value)}
                                    onKeyPress={(e) => {
                                      if (e.key === 'Enter') {
                                        confirmAddProduct(person.id);
                                      }
                                    }}
                                    onKeyDown={(e) => {
                                      if (e.key === 'Escape') {
                                        cancelAddProduct();
                                      }
                                    }}
                                    onBlur={() => {
                                      if (newProductName.trim()) {
                                        confirmAddProduct(person.id);
                                      } else {
                                        cancelAddProduct();
                                      }
                                    }}
                                    placeholder="Enter product name..."
                                    className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:border-gray-500"
                                  />
                                </td>
                                <td className="px-4 py-3 text-right text-gray-300">$0.00</td>
                                <td className="px-4 py-3 text-right text-gray-300">$0.00</td>
                                <td className="px-4 py-3 text-gray-300 text-sm">—</td>
                                <td className="px-4 py-3"></td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>

                      {/* Mobile Card View */}
                      <div className="lg:hidden">
                        {person.products.map(product => (
                          <div key={product.id} className="border-t border-gray-100 p-3 group">
                            <div className="flex justify-between items-start mb-2">
                              {/* Product Name */}
                              {editingProduct === `${person.id}-${product.id}-name` ? (
                                <input
                                  type="text"
                                  defaultValue={product.name}
                                  onBlur={(e) => {
                                    updateProduct(person.id, product.id, 'name', e.target.value);
                                    setEditingProduct(null);
                                  }}
                                  onKeyPress={(e) => {
                                    if (e.key === 'Enter') {
                                      updateProduct(person.id, product.id, 'name', e.target.value);
                                      setEditingProduct(null);
                                    }
                                  }}
                                  className="flex-1 px-2 py-2 border border-gray-300 rounded focus:outline-none focus:border-gray-500 text-base"
                                  autoFocus
                                />
                              ) : (
                                <span 
                                  className="text-gray-700 font-medium cursor-pointer hover:text-gray-900 flex-1 text-base"
                                  onClick={() => setEditingProduct(`${person.id}-${product.id}-name`)}
                                >
                                  {product.name}
                                </span>
                              )}
                              
                              {/* Delete button - always visible on mobile */}
                              <button
                                onClick={() => deleteProduct(person.id, product.id)}
                                className="text-gray-400 hover:text-red-500 p-2 -mr-2"
                                title="Delete product"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              </button>
                            </div>
                            
                            {/* Price Row */}
                            <div className="flex justify-between items-center mb-2">
                              <div className="flex items-center gap-4">
                                <div>
                                  <span className="text-xs text-gray-400 block">Price</span>
                                  {editingProduct === `${person.id}-${product.id}-price` ? (
                                    <input
                                      type="number"
                                      defaultValue={product.price}
                                      onBlur={(e) => {
                                        updateProduct(person.id, product.id, 'price', e.target.value);
                                        setEditingProduct(null);
                                      }}
                                      onKeyPress={(e) => {
                                        if (e.key === 'Enter') {
                                          updateProduct(person.id, product.id, 'price', e.target.value);
                                          setEditingProduct(null);
                                        }
                                      }}
                                      className="w-20 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:border-gray-500 text-base"
                                      autoFocus
                                    />
                                  ) : (
                                    <span 
                                      className="text-gray-600 cursor-pointer hover:text-gray-800 text-base"
                                      onClick={() => setEditingProduct(`${person.id}-${product.id}-price`)}
                                    >
                                      ${product.price.toFixed(2)}
                                    </span>
                                  )}
                                </div>
                                <div>
                                  <span className="text-xs text-gray-400 block">With Tax</span>
                                  <span className="text-gray-700 font-medium text-base">
                                    ${(product.price * 1.1).toFixed(2)}
                                  </span>
                                </div>
                              </div>
                            </div>
                            
                            {/* Links */}
                            <div>
                              {product.links.length > 0 && (
                                <div className="flex flex-col gap-2 mb-2">
                                  {product.links.map((link, index) => (
                                    <div key={index} className="flex items-center gap-2">
                                      {editingProduct === `${person.id}-${product.id}-link-${index}` ? (
                                        <input
                                          type="text"
                                          defaultValue={link}
                                          onBlur={(e) => {
                                            updateLink(person.id, product.id, index, e.target.value);
                                            setEditingProduct(null);
                                          }}
                                          onKeyPress={(e) => {
                                            if (e.key === 'Enter') {
                                              updateLink(person.id, product.id, index, e.target.value);
                                              setEditingProduct(null);
                                            }
                                          }}
                                          className="flex-1 px-2 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:border-gray-500"
                                          autoFocus
                                        />
                                      ) : (
                                        <>
                                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-gray-800 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                                          </svg>
                                          <a 
                                            href={link} 
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-gray-500 hover:text-gray-700 hover:underline text-sm truncate"
                                          >
                                            {link.replace(/^https?:\/\//, '').substring(0, 25)}{link.replace(/^https?:\/\//, '').length > 25 ? '...' : ''}
                                          </a>
                                          <button
                                            onClick={() => setEditingProduct(`${person.id}-${product.id}-link-${index}`)}
                                            className="text-gray-400 hover:text-gray-600 p-1 flex-shrink-0"
                                          >
                                            ✎
                                          </button>
                                          <button
                                            onClick={() => deleteLink(person.id, product.id, index)}
                                            className="text-gray-400 hover:text-red-500 p-1 flex-shrink-0"
                                          >
                                            ✕
                                          </button>
                                        </>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              )}
                              <button
                                onClick={() => addLink(person.id, product.id)}
                                className="text-gray-400 hover:text-gray-600 flex items-center gap-1 text-sm py-1"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                                Add link
                              </button>
                            </div>
                          </div>
                        ))}
                        
                        {/* New Product Input - Mobile */}
                        {addingProductFor === person.id && (
                          <div className="border-t border-gray-100 p-3 bg-gray-50">
                            <input
                              ref={newProductInputRef}
                              type="text"
                              value={newProductName}
                              onChange={(e) => setNewProductName(e.target.value)}
                              onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                  confirmAddProduct(person.id);
                                }
                              }}
                              onKeyDown={(e) => {
                                if (e.key === 'Escape') {
                                  cancelAddProduct();
                                }
                              }}
                              onBlur={() => {
                                if (newProductName.trim()) {
                                  confirmAddProduct(person.id);
                                } else {
                                  cancelAddProduct();
                                }
                              }}
                              placeholder="Enter product name..."
                              className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-500 text-base"
                            />
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {people.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            No people added yet. Click + to get started.
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteModal.show && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-sm w-full mx-4 overflow-hidden">
            <div className="p-4 sm:p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Delete {deleteModal.personName}?
              </h3>
              <p className="text-gray-500 text-sm">
                This will remove all their products. This action cannot be undone.
              </p>
            </div>
            <div className="bg-gray-50 px-4 sm:px-6 py-3 sm:py-4 flex justify-end gap-3">
              <button
                onClick={cancelDelete}
                className="px-4 py-3 sm:py-2 text-gray-600 hover:text-gray-800 font-medium transition-colors text-base sm:text-sm"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-3 sm:py-2 bg-gray-800 text-white rounded-lg hover:bg-black font-medium transition-colors text-base sm:text-sm"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Export Modal */}
      {exportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 overflow-hidden max-h-[90vh] flex flex-col">
            <div className="p-4 sm:p-6 overflow-y-auto flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Export to Excel
              </h3>
              
              {/* Export All Option */}
              <button
                onClick={exportAllToExcel}
                className="w-full text-left p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors mb-3 active:bg-gray-100"
              >
                <div className="font-medium text-gray-900">Export All</div>
                <div className="text-sm text-gray-500">Download everyone's purchases in one file</div>
              </button>
              
              {/* Individual Export Options */}
              {people.length > 0 && (
                <div>
                  <div className="text-xs text-gray-400 uppercase tracking-wider mb-2">Or export individual</div>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {people.map(person => (
                      <button
                        key={person.id}
                        onClick={() => exportPersonToExcel(person)}
                        className="w-full text-left px-4 py-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors flex justify-between items-center active:bg-gray-100"
                      >
                        <span className="font-medium text-gray-700">{person.name}</span>
                        <span className="text-sm text-gray-400">{person.products.length} items</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="bg-gray-50 px-4 sm:px-6 py-3 sm:py-4 flex justify-end flex-shrink-0">
              <button
                onClick={() => setExportModal(false)}
                className="px-4 py-3 sm:py-2 text-gray-600 hover:text-gray-800 font-medium transition-colors text-base sm:text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
