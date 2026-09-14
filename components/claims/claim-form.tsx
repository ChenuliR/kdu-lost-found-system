"use client";

import { Button } from "@/components/ui/button";
import { AlertCircle, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { submitClaim } from "../../app/(authenticated)/claims/actions";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Field, FieldDescription, FieldLabel } from "../ui/field";
import { Textarea } from "../ui/textarea";
import { Input } from "../ui/input";

interface ClaimFormProps {
  postId: string;
  itemName: string;
}

export function ClaimForm({ postId, itemName }: ClaimFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    proof_details: "",
    contact_info: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      if (!formData.proof_details.trim()) {
        setError("Proof details are required");
        setIsLoading(false);
        return;
      }

      if (!formData.contact_info.trim()) {
        setError("Contact information is required");
        setIsLoading(false);
        return;
      }

      const result = await submitClaim(postId, formData);

      if (result.error) {
        setError(result.error);
        setIsLoading(false);
        return;
      }

      router.push("/claims/my-claims");
    } catch (err) {
      setError("Failed to submit claim. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <Card className="rounded-sm">
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-8">
          {error && (
            <div className="flex gap-3 rounded-lg p-4 bg-red-50 dark:bg-red-950 text-red-900 dark:text-red-300">
              <AlertCircle className="h-5 w-5 shrink-0" />
              <p className="text-sm">{error}</p>
            </div>
          )}

          <Field>
            <FieldLabel htmlFor="proof_details">
              Details Proving Ownership
            </FieldLabel>
            <FieldDescription>
              Provide specific details that prove you own this item. Include
              serial numbers, distinctive marks, or other identifying
              information.
            </FieldDescription>
            <Textarea
              id="proof_details"
              name="proof_details"
              placeholder="E.g., The serial number is C02x-322..., the wallpaper is a picture of..."
              value={formData.proof_details}
              onChange={handleChange}
              rows={5}
              disabled={isLoading}
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="contact_info">Contact Information</FieldLabel>
            <FieldDescription>
              How can the item owner contact you? (Email or phone number)
            </FieldDescription>
            <Input
              id="contact_info"
              name="contact_info"
              type="text"
              placeholder="Email or Phone Number"
              value={formData.contact_info}
              onChange={handleChange}
              disabled={isLoading}
            />
          </Field>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full cursor-pointer"
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isLoading ? "Submitting..." : "Submit Claim"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
