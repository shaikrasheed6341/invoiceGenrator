import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Edit, Trash2, Plus, Package, Search } from 'lucide-react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import tokenManager from '../../utils/tokenManager';

const ViewProducts = () => {
    const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
 
  const [editingProduct, setEditingProduct] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  // Fetch products on component mount
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const token = tokenManager.getToken();
      const response = await axios.get('http://localhost:5000/iteam/viewproducts', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      console.log('Products response:', response.data);
      if (response.data.success) {
        setProducts(response.data.data);
      } else {
        toast.error('Failed to fetch products');
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Error fetching products');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (productId, productName) => {
    if (window.confirm(`Are you sure you want to delete "${productName}"?`)) {
      try {
        const token = tokenManager.getToken();
        const response = await axios.delete(`http://localhost:5000/iteam/delete/${productId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (response.data.message) {
          toast.success(response.data.message);
        } else {
          toast.success('Product deleted successfully');
        }
        fetchProducts(); // Refresh the list
      } catch (error) {
        console.error('Error deleting product:', error);
        const errorMessage = error.response?.data?.message || 'Error deleting product';
        toast.error(errorMessage);
      }
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setShowEditModal(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const token = tokenManager.getToken();
      await axios.put(`http://localhost:5000/iteam/update/${editingProduct.name}`, {
        brand: editingProduct.brand,
        rate: editingProduct.rate,
        tax: editingProduct.tax
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      toast.success('Product updated successfully');
      setShowEditModal(false);
      setEditingProduct(null);
      fetchProducts(); // Refresh the list
    } catch (error) {
      console.error('Error updating product:', error);
      toast.error('Error updating product');
    }
  };


  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.brand.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-zinc-600 mx-auto"></div>
          <p className="mt-4 text-zinc-600">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-zinc-600 to-zinc-700 rounded-xl flex items-center justify-center">
                <Package className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-zinc-900">Products</h1>
                <p className="text-zinc-600">Manage your product inventory</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-zinc-300 rounded-lg focus:ring-2 focus:ring-zinc-500 focus:border-transparent w-64"
                />
              </div>
              <button
                onClick={() => window.location.href = '/selectiteams'}
                className="flex items-center space-x-2 bg-gradient-to-r from-zinc-600 to-zinc-700 text-white px-4 py-2 rounded-lg hover:from-zinc-700 hover:to-zinc-800 transition-all duration-200"
              >
                <Plus className="w-4 h-4" />
                <span>Add Product</span>
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gradient-to-r from-zinc-50 to-zinc-100 p-4 rounded-xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-zinc-600">Total Products</p>
                  <p className="text-2xl font-bold text-zinc-900">{products.length}</p>
                </div>
                <Package className="w-8 h-8 text-zinc-500" />
              </div>
            </div>
            <div className="bg-gradient-to-r from-zinc-50 to-zinc-100 p-4 rounded-xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-zinc-600">Filtered Products</p>
                  <p className="text-2xl font-bold text-zinc-900">{filteredProducts.length}</p>
                </div>
                <div className="w-8 h-8 bg-zinc-500 rounded-full flex items-center justify-center">
                  <div className="w-3 h-3 bg-white rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Products Table */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-zinc-50 to-zinc-100">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">
                    Brand
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">
                    Rate
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">
                    Tax
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-zinc-200">
                {filteredProducts.map((product, index) => (
                  <tr key={product.id} className="hover:bg-zinc-50 transition-colors duration-200">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gradient-to-br from-zinc-600 to-zinc-700 rounded-lg flex items-center justify-center mr-3">
                          <Package className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-zinc-900">{product.name}</div>
                          <div className="text-sm text-zinc-500">ID: {product.id.slice(0, 8)}...</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-zinc-100 text-zinc-800">
                        {product.brand}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-zinc-900">₹{product.rate?.toLocaleString()}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-zinc-100 text-zinc-800">
                        {product.tax}%
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleEdit(product)}
                          className="text-zinc-600 hover:text-zinc-900 p-1 rounded-lg hover:bg-zinc-50 transition-colors duration-200"
                          title="Edit Product"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(product.id, product.name)}
                          className="text-red-600 hover:text-red-900 p-1 rounded-lg hover:bg-red-50 transition-colors duration-200"
                          title="Delete Product"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-12">
              <Package className="w-12 h-12 text-zinc-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-zinc-900 mb-2">No products found</h3>
              <p className="text-zinc-500">
                {searchTerm ? 'No products found matching your search.' : 'Get started by adding your first product.'}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Edit Modal */}
      {showEditModal && editingProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-zinc-900 mb-4">Edit Product</h3>
            <form onSubmit={handleUpdate}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-700 mb-1">Product Name</label>
                  <input
                    type="text"
                    value={editingProduct.name}
                    disabled
                    className="w-full px-3 py-2 border border-zinc-300 rounded-lg bg-zinc-50 text-zinc-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-700 mb-1">Brand</label>
                  <input
                    type="text"
                    value={editingProduct.brand}
                    onChange={(e) => setEditingProduct({...editingProduct, brand: e.target.value})}
                    className="w-full px-3 py-2 border border-zinc-300 rounded-lg focus:ring-2 focus:ring-zinc-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-700 mb-1">Rate (₹)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={editingProduct.rate}
                    onChange={(e) => setEditingProduct({...editingProduct, rate: parseFloat(e.target.value)})}
                    className="w-full px-3 py-2 border border-zinc-300 rounded-lg focus:ring-2 focus:ring-zinc-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-700 mb-1">Tax (%)</label>
                  <input
                    type="number"
                    value={editingProduct.tax}
                    onChange={(e) => setEditingProduct({...editingProduct, tax: parseInt(e.target.value)})}
                    className="w-full px-3 py-2 border border-zinc-300 rounded-lg focus:ring-2 focus:ring-zinc-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>
              <div className="flex items-center justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 text-zinc-700 bg-zinc-100 rounded-lg hover:bg-zinc-200 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-zinc-600 text-white rounded-lg hover:bg-zinc-700 transition-colors duration-200"
                >
                  Update Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      <ToastContainer />
    </div>
  );
};

export default ViewProducts; 