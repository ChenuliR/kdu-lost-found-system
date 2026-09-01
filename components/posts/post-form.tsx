"use client";

import { createPost } from "@/app/(authenticated)/posts/actions";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { AlertCircle, ImageUp, Info, Loader2, X } from "lucide-react";
import Link from "next/link";
import { useRef, useState } from "react";

const categories = [
  {
    label: "Select a category",
    value: null,
  },
  {
    label: "Laptop/Computer",
    value: "laptop/computer",
  },
  {
    label: "Phone",
    value: "phone",
  },
  {
    label: "Wallet/Cash",
    value: "wallet/cash",
  },
  {
    label: "Backpack/Bag",
    value: "backpack/bag",
  },
  {
    label: "Keys",
    value: "keys",
  },
  {
    label: "Headphones/Earbuds",
    value: "headphones/earbuds",
  },
  {
    label: "Watch",
    value: "watch",
  },
  {
    label: "Water Bottle",
    value: "water-bottle",
  },
  {
    label: "Clothing",
    value: "clothing",
  },
  {
    label: "Documents/ID",
    value: "documents/id",
  },
  {
    label: "Books/Notebooks",
    value: "books/notebooks",
  },
  {
    label: "Jewellery",
    value: "jewellery",
  },
  {
    label: "Other",
    value: "other",
  },
];

const ALLOWED_TYPES = ["image/jpeg", "image/png"];

export default function PostForm({ postType }: { postType: PostType }) {
  const dateInputRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [formData, setFormData] = useState<PostForm>({
    itemName: "",
    category: null,
    date: "",
    location: "",
    description: "",
    image: null,
  });

  // Handle input changes
  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const openDatePicker = () => {
    if (dateInputRef.current) {
      dateInputRef.current.showPicker();
    }
  };

  const handleFileChange = (file: File) => {
    if (!ALLOWED_TYPES.includes(file.type)) {
      setError("Only JPG and PNG files are allowed");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError("File size must be less than 10MB");
      return;
    }

    setPhotoFile(file);
    setError(null);

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPhotoPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Drag and drog handler
  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    console.log(
      "Drag event:",
      e.type,
      "dragActive will be:",
      e.type === "dragenter" || e.type === "dragover",
    );
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleFileChange(files[0]);
    }
  };

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const fd = new FormData();
      fd.append("itemName", formData.itemName);
      fd.append("category", formData.category ?? "");
      fd.append("date", formData.date);
      fd.append("location", formData.location);
      fd.append("description", formData.description);
      fd.append("image", photoFile || new Blob());

      await createPost(fd, postType);
    } catch (err) {
      const error = err instanceof Error ? err.message : "Error occurred";
      setError(error);
      setIsLoading(false);
    }
  };

  // Clear photo
  const handleClearPhoto = () => {
    setPhotoFile(null);
    setPhotoPreview(null);
  };

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit}>
        <FieldGroup>
          <FieldSet>
            <FieldSeparator className="mt-2" />
            {/* Error Message */}
            {error && (
              <div className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4">
                <AlertCircle className="h-5 w-5 shrink-0 text-red-800" />
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}
            <FieldGroup>
              <div className="grid grid-cols-2 gap-7">
                {/* Item Name */}
                <Field>
                  <FieldLabel htmlFor="item-name">Item Name</FieldLabel>
                  <Input
                    id="item-name"
                    placeholder="e.g. Blue Hydroflask"
                    required
                    disabled={isLoading}
                    value={formData.itemName}
                    onChange={(e) =>
                      handleInputChange("itemName", e.target.value)
                    }
                  />
                </Field>
                {/* Category */}
                <Field>
                  <FieldLabel htmlFor="category">Category</FieldLabel>
                  <Select
                    items={categories}
                    required
                    disabled={isLoading}
                    value={formData.category}
                    onValueChange={(val) =>
                      handleInputChange("category", val ?? "")
                    }
                  >
                    <SelectTrigger id="category">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {categories.map((item) => (
                          <SelectItem key={item.value} value={item.value}>
                            {item.label}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </Field>
                {/* Date */}
                <Field>
                  <FieldLabel htmlFor="date">
                    Date {postType === "lost" ? "Lost" : "Found"}
                  </FieldLabel>
                  <InputGroup>
                    <InputGroupInput
                      id="date"
                      ref={dateInputRef}
                      type="date"
                      required
                      disabled={isLoading}
                      className="cursor-pointer"
                      value={formData.date}
                      onChange={(e) =>
                        handleInputChange("date", e.target.value)
                      }
                      onClick={openDatePicker}
                    />
                    <InputGroupAddon align="inline-end">
                      <span className="sr-only">Select date</span>
                    </InputGroupAddon>
                  </InputGroup>
                  {/* {isInvalid && <FieldError errors={field.state.meta.errors} />} */}
                </Field>
                <Field>
                  <FieldLabel htmlFor="location">Location</FieldLabel>
                  <Input
                    id="location"
                    placeholder="e.g. Student Union Library"
                    required
                    disabled={isLoading}
                    value={formData.location}
                    onChange={(e) =>
                      handleInputChange("location", e.target.value)
                    }
                  />
                </Field>
              </div>
            </FieldGroup>
          </FieldSet>
          {/* Description */}
          <FieldSet>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="description">Description</FieldLabel>
                <FieldDescription className="flex items-center gap-1 text-xs">
                  <Info size={16} />
                  Ensure descriptions are clear, while refraining from including
                  private details.
                </FieldDescription>
                <Textarea
                  id="description"
                  placeholder="Add any additional details"
                  className="resize-none"
                  required
                  disabled={isLoading}
                  value={formData.description}
                  onChange={(e) =>
                    handleInputChange("description", e.target.value)
                  }
                />
              </Field>
            </FieldGroup>
          </FieldSet>
          {/* Image Upload */}
          <FieldSet>
            <FieldGroup>
              <Field>
                <FieldLabel>Photo Upload</FieldLabel>
                <div
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                  className={`rounded-lg border-2 border-dashed p-8 text-center transition-colors ${
                    dragActive
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-300 bg-gray-50"
                  } ${isLoading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                >
                  {photoPreview ? (
                    <div className="flex flex-col items-center gap-4 pointer-events-auto">
                      <div className="relative">
                        <img
                          src={photoPreview}
                          alt="Preview"
                          className="max-h-48 rounded-lg object-cover"
                        />
                        <Button
                          type="button"
                          size={"icon-sm"}
                          onClick={handleClearPhoto}
                          disabled={isLoading}
                          className="flex items-center gap-2 text-sm rounded-sm border border-primary disabled:opacity-50 absolute top-0 right-0 translate-x-3 -translate-y-3 cursor-pointer"
                        >
                          <X size={16} strokeWidth={3} />
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <input
                        type="file"
                        name="photo"
                        accept="image/jpeg,image/png"
                        onChange={(e) => {
                          if (e.target.files && e.target.files.length > 0) {
                            handleFileChange(e.target.files[0]);
                          }
                        }}
                        style={{ display: "none" }}
                        id="file-input"
                        disabled={isLoading}
                      />
                      <label
                        htmlFor="file-input"
                        className="cursor-pointer"
                      >
                        <div className="flex flex-col items-center gap-2">
                          <ImageUp
                            size={60}
                            className="text-gray-400"
                            strokeWidth={1.2}
                          />
                          <p className="text-sm font-medium text-gray-700">
                            Click to upload or drag and drop
                          </p>
                          <p className="text-xs text-gray-500">
                            JPEG, JPG, PNG up to 10MB
                          </p>
                        </div>
                      </label>
                    </>
                  )}
                </div>
              </Field>
            </FieldGroup>
          </FieldSet>
          {/* Buttons */}
          <Field orientation="horizontal">
            <Button
              type="submit"
              disabled={isLoading}
              className="cursor-pointer"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                "Create Post"
              )}
            </Button>
            <Button
              variant="outline"
              type="button"
              disabled={isLoading}
              className="cursor-pointer"
              nativeButton={false}
             render={<Link href={"/posts/my-posts"} replace />}
            >
              Cancel
            </Button>
          </Field>
        </FieldGroup>
      </form>
    </div>
  );
}
