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
import { Loader2, Plus, Image as ImageIcon } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

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
  const [categories, setCategories] = useState<{id: string, name: string}[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

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

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const [productsRes, categoriesRes] = await Promise.all([
        supabase.from("products").select("*").order("created_at", { ascending: false }),
        supabase.from("categories").select("*").order("name", { ascending: true })
      ]);
      
      if (productsRes.error) throw productsRes.error;
      if (productsRes.data) setProducts(productsRes.data);
      
      if (categoriesRes.data) {
        setCategories(categoriesRes.data);
        if (categoriesRes.data.length > 0 && formData.category === "Vegetables") {
           // Default to first category if 'Vegetables' is not the standard or we want dynamic default
           setFormData(prev => ({ ...prev, category: categoriesRes.data[0].name }));
        }
      }
    } catch (error) {
      console.error("Error fetching data:", error);
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
      let imageUrl = "";
      if (imageFile) {
        imageUrl = await handleImageUpload(imageFile);
      }

      const { error } = await supabase.from("products").insert([
        {
          title: formData.title,
          price: parseFloat(formData.price),
          original_price: formData.original_price ? parseFloat(formData.original_price) : null,
          description: formData.description,
          category: formData.category,
          trending: formData.trending,
          image_url: imageUrl,
        },
      ]);
      if (error) throw error;
      setIsOpen(false);
      setImageFile(null);
      setFormData({ title: "", price: "", original_price: "", description: "", category: categories.length > 0 ? categories[0].name : "Vegetables", trending: false });
      fetchProducts();
    } catch (error: any) {
      console.error("Error saving product:", error);
      alert("Failed to save product: " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <div className="p-8 flex justify-center"><Loader2 className="animate-spin text-[var(--forest-deep)]" /></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-display font-bold text-gray-900">Products</h1>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[var(--forest-deep)] hover:bg-[var(--forest)] text-white rounded-xl flex items-center gap-2">
              <Plus className="h-4 w-4" /> Add Product
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px] rounded-2xl">
            <DialogHeader>
              <DialogTitle className="font-display text-2xl text-[var(--forest-deep)]">New Product</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div>
                <label className="text-xs font-medium text-gray-500 uppercase mb-1 block">Title</label>
                <Input
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="rounded-xl border-gray-200 focus-visible:ring-[var(--forest-deep)]"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase mb-1 block">Offer Price (₹)</label>
                  <Input
                    required
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="rounded-xl border-gray-200 focus-visible:ring-[var(--forest-deep)]"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase mb-1 block">Real Price (₹)</label>
                  <Input
                    type="number"
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
                      <option key={c.id} value={c.name}>{c.name}</option>
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
                  className="rounded-xl border-gray-200 focus-visible:ring-[var(--forest-deep)]"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 uppercase mb-1 block">Product Image</label>
                <div className="flex items-center gap-3">
                  <label className="flex h-10 w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-gray-300 bg-gray-50 px-4 text-sm text-gray-600 transition hover:bg-gray-100 hover:text-gray-900">
                    <ImageIcon className="h-4 w-4" />
                    {imageFile ? imageFile.name : "Upload Image"}
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
                <label htmlFor="trending" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Mark as Trending
                </label>
              </div>
              <Button type="submit" disabled={isSubmitting} className="w-full bg-[var(--forest-deep)] hover:bg-[var(--forest)] text-white rounded-xl py-6 mt-4">
                {isSubmitting ? <Loader2 className="animate-spin h-5 w-5" /> : "Save Product"}
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
              <TableHead className="font-semibold text-gray-900">Price</TableHead>
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
                        <div className="h-full w-full flex items-center justify-center text-gray-400"><ImageIcon className="h-5 w-5" /></div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-semibold text-gray-900 text-base">{product.title}</div>
                    <div className="text-xs text-gray-500 truncate max-w-[250px] mt-0.5">{product.description}</div>
                  </TableCell>
                  <TableCell>
                    <span className="inline-flex items-center rounded-full bg-[var(--fresh)]/20 px-2 py-0.5 text-xs font-medium text-[var(--forest-deep)]">
                      {product.category || 'Uncategorized'}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="font-semibold text-gray-900">
                      ₹{product.price}
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
                    <Button variant="outline" size="sm" className="rounded-lg">
                      Edit
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
