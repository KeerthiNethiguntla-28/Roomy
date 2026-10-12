"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useDeletePostMutation } from "@/store/services/post-service";
import toast, { Toaster } from "react-hot-toast";

interface CardProps {
  key: string;
  propertyId: string;
  title: string;
  description: string;
  price: string;
  imageSrc: string;
  isTag?: string;
  isApproved?: boolean;
}

export function PropertyCard({ propertyId, title, description, price, imageSrc, isTag, isApproved }: CardProps) {
  const [openModal, setOpenModal] = useState(true);
  return (
    <>
      <Toaster></Toaster>
      <div className="relative group overflow-hidden rounded-lg shadow-lg">
        {(isTag != "true" && (
          <Link className="absolute inset-0 z-10" href={`/all-listings/${propertyId}`}>
            <span className="sr-only">View property</span>
          </Link>
        )) || <div></div>}

        <img
          alt="Property 2"
          className="object-cover w-full h-60"
          height={300}
          src={imageSrc}
          style={{
            aspectRatio: "400/300",
            objectFit: "cover",
          }}
          width={400}
        />

        <div className="bg-white p-4 dark:bg-gray-950 relative flex items-center">
          <div>
            <h3 className="font-semibold text-lg md:text-xl">{title}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">{description}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">{price}</p>
          </div>
          {isTag == "true" && <>{<PostActions isApproved={isApproved} propertyId={propertyId} />}</>}
        </div>
      </div>
    </>
  );
}
function PostActions({ isApproved, propertyId }: { isApproved?: boolean; propertyId: string }) {
  const [
    deletePost,
    {
      data: deleteData,
      error: deleteError,
      isLoading: deleteLoading,
      isError: isDeleteError,
      isSuccess: isDeleteSuccess,
    },
  ] = useDeletePostMutation();
  function handleDelete() {
    deletePost(propertyId!);
  }

  useEffect(() => {
    if (isDeleteError) {
      toast.error("Error deleting post");
    }
    if (deleteData || isDeleteSuccess) {
      toast.success("Post deleted successfully");
    }
  }, [isDeleteError, deleteData]);

  function handleEdit() {
    throw new Error("Function not implemented.");
  }

  return (
    <>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button
            style={{
              backgroundColor: "white",
              marginLeft: "148px",
            }}
          >
            <span
              className={`${
                isApproved ? "bg-green-500" : "bg-red-500"
              } text-white text-xs font-semibold px-2 py-1 rounded-full ml-auto`}
            >
              {isApproved ? "Approved" : "Pending"}
            </span>
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              You will be able to edit or delete this post. Deleting a post is permanent. You will have to recreate it.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleDelete}>
              {deleteLoading ? "Deleting..." : "Delete"}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleEdit}
              style={{
                backgroundColor: "#5c4cda",
              }}
            >
              Edit
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
