import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { supabase } from "@/lib/supabase";
import { Loader2, Plus, Trash2, Pencil, Image as ImageIcon } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { fetchAllProducts, fetchAllCategories, insertProduct, updateProduct, deleteProduct } from "./admin.server";

export const Route = createFileRoute("/admin/products")({
  component: AdminProducts,
});

type Product = {
  id: string;
  title: string;
  price: number;
  original_price?: number;
  description: string;
  image_url: string;
  category: string;
  trending: boolean;
};

function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    price: "",
    original_price: "",
    description: "",
    category: "Vegetables",
    trending: false,
  });
  const [imageFile, setImageFile] = useState<File | null>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      setEditingProduct(null);
      setFormData({
        title: "",
        price: "",
        original_price: "",
        description: "",
        category: categories.length > 0 ? categories[0].name : "Vegetables",
        trending: false,
      });
      setImageFile(null);
    }
  };

  const openEditDialog = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      title: product.title || "",
      price: product.price !== undefined && product.price !== null ? product.price.toString() : "",
      original_price: product.original_price !== undefined && product.original_price !== null ? product.original_price.toString() : "",
      description: product.description || "",
      category: product.category || (categories.length > 0 ? categories[0].name : "Vegetables"),
      trending: !!product.trending,
    });
    setImageFile(null);
    setIsOpen(true);
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const [productsData, categoriesData] = await Promise.all([
        fetchAllProducts(),
        fetchAllCategories(),
      ]);
      setProducts(productsData as Product[]);
      setCategories(categoriesData as { id: string; name: string }[]);
      if (categoriesData.length > 0 && formData.category === "Vegetables") {
        setFormData((prev) => ({ ...prev, category: categoriesData[0].name }));
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (file: File) => {
    const fileExt = file.name.split(".").pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error: uploadError } = await supabase.storage.from("products").upload(filePath, file);

    if (uploadError) {
      throw uploadError;
    }

    const { data } = supabase.storage.from("products").getPublicUrl(filePath);
    return data.publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      let imageUrl = editingProduct ? editingProduct.image_url : "";
      if (imageFile) {
        imageUrl = await handleImageUpload(imageFile);
      }

      const payload = {
        title: formData.title,
        price: parseFloat(formData.price) || 0,
        original_price: formData.original_price ? parseFloat(formData.original_price) : null,
        description: formData.description,
        category: formData.category,
        trending: formData.trending,
        image_url: imageUrl,
      };

      if (editingProduct) {
        await updateProduct({ data: { id: editingProduct.id, payload } });
      } else {
        await insertProduct({ data: payload });
      }

      toast.success(editingProduct ? "Product updated successfully!" : "Product created successfully!");
      handleOpenChange(false);
      fetchProducts();
    } catch (error: any) {
      console.error("Error saving product:", error);
      toast.error("Failed to save product: " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    try {
      await deleteProduct({ data: { id } });
      toast.success("Product deleted successfully");
      fetchProducts();
    } catch (error: any) {
      console.error("Error deleting product:", error);
      toast.error("Failed to delete product: " + error.message);
    }
  };

  if (loading) {
    return (
      <div className="p-8 flex justify-center">
        <Loader2 className="animate-spin text-[var(--forest-deep)]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-display font-bold text-gray-900">Products</h1>
        <Dialog open={isOpen} onOpenChange={handleOpenChange}>
          <DialogTrigger asChild>
            <Button className="bg-[var(--forest-deep)] hover:bg-[var(--forest)] text-white rounded-xl flex items-center gap-2">
              <Plus className="h-4 w-4" /> Add Product
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px] rounded-2xl">
            <DialogHeader>
              <DialogTitle className="font-display text-2xl text-[var(--forest-deep)]">
                {editingProduct ? "Edit Product" : "New Product"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div>
                <label className="text-xs font-medium text-gray-500 uppercase mb-1 block">Title</label>
                <Input
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Farm Fresh Tomatoes"
                  className="rounded-xl border-gray-200 focus-visible:ring-[var(--forest-deep)]"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase mb-1 block">Price per kg (₹)</label>
                  <Input
                    required
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="40"
                    className="rounded-xl border-gray-200 focus-visible:ring-[var(--forest-deep)]"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase mb-1 block">Real Price (₹)</label>
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="Optional"
                    value={formData.original_price}
                    onChange={(e) => setFormData({ ...formData, original_price: e.target.value })}
                    className="rounded-xl border-gray-200 focus-visible:ring-[var(--forest-deep)]"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 uppercase mb-1 block">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="flex h-10 w-full rounded-xl border border-gray-200 bg-background px-3 py-2 text-sm outline-none focus:border-[var(--forest-deep)]"
                >
                  {categories.length === 0 ? (
                    <>
                      <option value="Vegetables">Vegetables</option>
                      <option value="Fruits">Fruits</option>
                      <option value="Seafood">Seafood</option>
                    </>
                  ) : (
                    categories.map((c) => (
                      <option key={c.id} value={c.name}>
                        {c.name}
                      </option>
                    ))
                  )}
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 uppercase mb-1 block">Description</label>
                <Input
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Short description of produce"
                  className="rounded-xl border-gray-200 focus-visible:ring-[var(--forest-deep)]"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 uppercase mb-1 block">
                  Product Image {editingProduct && "(Leave empty to keep current)"}
                </label>
                <div className="flex items-center gap-3">
                  <label className="flex h-10 w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-gray-300 bg-gray-50 px-4 text-sm text-gray-600 transition hover:bg-gray-100 hover:text-gray-900">
                    <ImageIcon className="h-4 w-4" />
                    {imageFile ? imageFile.name : editingProduct ? "Change Image" : "Upload Image"}
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files && e.target.files.length > 0) {
                          setImageFile(e.target.files[0]);
                        }
                      }}
                    />
                  </label>
                </div>
              </div>
              <div className="flex items-center space-x-2 pt-2">
                <Checkbox
                  id="trending"
                  checked={formData.trending}
                  onCheckedChange={(c) => setFormData({ ...formData, trending: !!c })}
                />
                <label
                  htmlFor="trending"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Mark as Trending
                </label>
              </div>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[var(--forest-deep)] hover:bg-[var(--forest)] text-white rounded-xl py-6 mt-4"
              >
                {isSubmitting ? (
                  <Loader2 className="animate-spin h-5 w-5" />
                ) : editingProduct ? (
                  "Update Product"
                ) : (
                  "Save Product"
                )}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-white rounded-[24px] shadow-sm border border-gray-100 overflow-hidden mt-6">
        <Table>
          <TableHeader className="bg-gray-50/50">
            <TableRow className="border-b border-gray-100">
              <TableHead className="w-[80px] font-semibold text-gray-900">Image</TableHead>
              <TableHead className="font-semibold text-gray-900">Product</TableHead>
              <TableHead className="font-semibold text-gray-900">Category</TableHead>
              <TableHead className="font-semibold text-gray-900">Price (₹/kg)</TableHead>
              <TableHead className="font-semibold text-gray-900">Trending</TableHead>
              <TableHead className="text-right font-semibold text-gray-900">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-64 text-center">
                  <div className="flex flex-col items-center justify-center text-gray-500">
                    <ImageIcon className="h-12 w-12 text-gray-300 mb-4" />
                    <p className="text-lg font-medium text-gray-900">No products found</p>
                    <p className="text-sm">Click "Add Product" to create your first one.</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              products.map((product) => (
                <TableRow key={product.id} className="hover:bg-gray-50/50 transition-colors">
                  <TableCell>
                    <div className="h-14 w-14 rounded-xl bg-gray-100 overflow-hidden border border-gray-100 shadow-sm">
                      {product.image_url ? (
                        <img src={product.image_url} alt={product.title} className="h-full w-full object-cover" />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center text-gray-400">
                          <ImageIcon className="h-5 w-5" />
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-semibold text-gray-900 text-base">{product.title}</div>
                    <div className="text-xs text-gray-500 truncate max-w-[250px] mt-0.5">{product.description}</div>
                  </TableCell>
                  <TableCell>
                    <span className="inline-flex items-center rounded-full bg-[var(--fresh)]/20 px-2 py-0.5 text-xs font-medium text-[var(--forest-deep)]">
                      {product.category || "Uncategorized"}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="font-semibold text-gray-900">
                      ₹{product.price} / kg
                      {product.original_price && product.original_price > product.price && (
                        <span className="text-red-500 line-through text-xs ml-2">₹{product.original_price}</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    {product.trending ? (
                      <span className="inline-flex h-2 w-2 rounded-full bg-green-500"></span>
                    ) : (
                      <span className="inline-flex h-2 w-2 rounded-full bg-gray-300"></span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="rounded-lg text-blue-500 hover:text-blue-700 hover:bg-blue-50 mr-1"
                      onClick={() => openEditDialog(product)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="rounded-lg text-red-500 hover:text-red-700 hover:bg-red-50"
                      onClick={() => handleDelete(product.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
