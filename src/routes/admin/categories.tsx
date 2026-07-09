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
import { Loader2, Plus, Trash2, Image as ImageIcon, Pencil } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/categories")({
  component: AdminCategories,
});

type Category = {
  id: string;
  name: string;
  image_url?: string;
  created_at: string;
};

function AdminCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [categoryName, setCategoryName] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      setEditingCategory(null);
      setCategoryName("");
      setImageFile(null);
    }
  };

  const openEditDialog = (category: Category) => {
    setEditingCategory(category);
    setCategoryName(category.name);
    setImageFile(null);
    setIsOpen(true);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .order("name", { ascending: true });
        
      if (error) {
        // If the table doesn't exist yet, don't crash, just show empty
        if (error.code === "42P01") {
          toast.error("Categories table not found. Please run the SQL command.");
        } else {
          throw error;
        }
      }
      
      if (data) setCategories(data);
    } catch (error: any) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (file: File) => {
    const fileExt = file.name.split(".").pop();
    const fileName = `categories/${Math.random()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage.from("products").upload(fileName, file);

    if (uploadError) {
      throw uploadError;
    }

    const { data } = supabase.storage.from("products").getPublicUrl(fileName);
    return data.publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryName.trim()) return;

    setIsSubmitting(true);
    try {
      let imageUrl = editingCategory ? editingCategory.image_url : null;
      if (imageFile) {
        imageUrl = await handleImageUpload(imageFile);
      }

      let error;
      if (editingCategory) {
        const { error: updateError } = await supabase.from("categories")
          .update({ name: categoryName.trim(), image_url: imageUrl })
          .eq("id", editingCategory.id);
        error = updateError;
      } else {
        const { error: insertError } = await supabase.from("categories").insert([
          { name: categoryName.trim(), image_url: imageUrl },
        ]);
        error = insertError;
      }
      
      if (error) {
        if (error.code === '23505') {
          toast.error("Category already exists!");
        } else {
          throw error;
        }
      } else {
        toast.success(editingCategory ? "Category updated successfully" : "Category added successfully");
        handleOpenChange(false);
        fetchCategories();
      }
    } catch (error: any) {
      console.error("Error saving category:", error);
      toast.error("Failed to save category: " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this category? Products using this category might be affected.")) return;
    
    try {
      const { error } = await supabase.from("categories").delete().eq("id", id);
      if (error) throw error;
      toast.success("Category deleted");
      fetchCategories();
    } catch (error: any) {
      console.error("Error deleting category:", error);
      toast.error("Failed to delete category");
    }
  };

  if (loading) {
    return <div className="p-8 flex justify-center"><Loader2 className="animate-spin text-[var(--forest-deep)]" /></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-display font-bold text-gray-900">Categories</h1>
        <Dialog open={isOpen} onOpenChange={handleOpenChange}>
          <DialogTrigger asChild>
            <Button className="bg-[var(--forest-deep)] hover:bg-[var(--forest)] text-white rounded-xl flex items-center gap-2">
              <Plus className="h-4 w-4" /> Add Category
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px] rounded-2xl">
            <DialogHeader>
              <DialogTitle className="font-display text-2xl text-[var(--forest-deep)]">
                {editingCategory ? "Edit Category" : "New Category"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div>
                <label className="text-xs font-medium text-gray-500 uppercase mb-1 block">Category Name</label>
                <Input
                  required
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
                  placeholder="e.g. Exotic Fruits"
                  className="rounded-xl border-gray-200 focus-visible:ring-[var(--forest-deep)]"
                />
              </div>
              
              <div>
                <label className="text-xs font-medium text-gray-500 uppercase mb-1 block">Category Image (Optional)</label>
                <div className="mt-1 flex justify-center rounded-xl border border-dashed border-gray-300 px-6 py-6 transition-colors hover:border-[var(--forest-deep)] bg-gray-50/50">
                  <div className="text-center">
                    <ImageIcon className="mx-auto h-8 w-8 text-gray-300" aria-hidden="true" />
                    <div className="mt-2 flex text-sm leading-6 text-gray-600 justify-center">
                      <label
                        htmlFor="category-file-upload"
                        className="relative cursor-pointer rounded-md bg-transparent font-semibold text-[var(--forest-deep)] focus-within:outline-none focus-within:ring-2 focus-within:ring-[var(--forest-deep)] focus-within:ring-offset-2 hover:text-[var(--forest)]"
                      >
                        <span>Upload a file</span>
                        <input
                          id="category-file-upload"
                          name="file-upload"
                          type="file"
                          className="sr-only"
                          accept="image/*"
                          onChange={(e) => {
                            if (e.target.files && e.target.files.length > 0) {
                              setImageFile(e.target.files[0]);
                            }
                          }}
                        />
                      </label>
                    </div>
                    {imageFile ? (
                      <p className="text-xs text-gray-500 truncate max-w-[200px] mt-1">{imageFile.name}</p>
                    ) : (
                      <p className="text-xs text-gray-500 mt-1">PNG, JPG, GIF up to 5MB</p>
                    )}
                  </div>
                </div>
              </div>
              
              <Button type="submit" disabled={isSubmitting || !categoryName.trim()} className="w-full bg-[var(--forest-deep)] hover:bg-[var(--forest)] text-white rounded-xl py-6 mt-4">
                {isSubmitting ? <Loader2 className="animate-spin h-5 w-5" /> : (editingCategory ? "Update Category" : "Save Category")}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-white rounded-[24px] shadow-sm border border-gray-100 overflow-hidden mt-6 max-w-3xl">
        <Table>
          <TableHeader className="bg-gray-50/50">
            <TableRow className="border-b border-gray-100">
              <TableHead className="w-16 font-semibold text-gray-900"></TableHead>
              <TableHead className="font-semibold text-gray-900">Name</TableHead>
              <TableHead className="font-semibold text-gray-900">Added On</TableHead>
              <TableHead className="text-right font-semibold text-gray-900">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="h-48 text-center">
                  <div className="flex flex-col items-center justify-center text-gray-500">
                    <p className="text-lg font-medium text-gray-900">No categories found</p>
                    <p className="text-sm">Click "Add Category" to create your first one.</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              categories.map((category) => (
                <TableRow key={category.id} className="hover:bg-gray-50/50 transition-colors">
                  <TableCell>
                    <div className="h-10 w-10 overflow-hidden rounded-lg bg-gray-100 flex items-center justify-center border border-gray-200">
                      {category.image_url ? (
                        <img src={category.image_url} alt={category.name} className="h-full w-full object-cover" />
                      ) : (
                        <ImageIcon className="h-4 w-4 text-gray-400" />
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-semibold text-gray-900 text-base">{category.name}</div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm text-gray-500">
                      {new Date(category.created_at).toLocaleDateString()}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="rounded-lg text-blue-500 hover:text-blue-700 hover:bg-blue-50 mr-2"
                      onClick={() => openEditDialog(category)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="rounded-lg text-red-500 hover:text-red-700 hover:bg-red-50"
                      onClick={() => handleDelete(category.id)}
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
