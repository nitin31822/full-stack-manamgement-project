
"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { createCompanySchema } from "@/zod-types/create-Company-Schema";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { ApiResponse } from "@/types/ApiResponse";
import { useToast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

function Page() {
  const queryClient = useQueryClient()
  const router  = useRouter()
  const { handleSubmit, register } = useForm<
    z.infer<typeof createCompanySchema>
  >({
    resolver: zodResolver(createCompanySchema),
  });
  const [creating, setIsCreating] = useState(false);
  const { toast } = useToast();

  const create = async (data: z.infer<typeof createCompanySchema>) => {
    setIsCreating(true);
    try {
      const response = await axios.post<ApiResponse>(
        "/api/company/create-company",
        data
      );
      if (response.data.success) {
        toast({
          title: "Company Created Successfully",
        });
      } else {
        toast({
          title: "Error",
          description: response.data.message,
          variant: "destructive",
        });
      }

      await queryClient.invalidateQueries({queryKey : ["companies"]})
        router.push("/companies")

    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <h1 className="pt-8 text-4xl font-semibold">Create Company</h1>
      <div className="h-96 lg:w-2/5 w-full  mt-8">
        <form onSubmit={handleSubmit(create)}>
          <div className="flex flex-col gap-4">
            <label htmlFor="name">Name</label>
            <Input
              className="pl-6 h-12"
              {...register("name")}
              autoFocus
              type="text"
              placeholder="Enter Company Name"
            />
            <label htmlFor="email">Email</label>
            <Input
              className="pl-6 h-12"
              {...register("email")}
              type="text"
              placeholder="Enter Company Email (Optional)"
            />
            <Button type="submit" variant="default" disabled={creating}>
              {creating ? "Creating..." : "Create Company"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Page;

