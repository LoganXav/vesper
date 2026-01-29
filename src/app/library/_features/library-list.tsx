"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { UploadIcon } from "lucide-react";
import { LibraryUploadDrawer } from "./library-upload-drawer";

export const LibraryList = () => {
  const [isUploadDrawerOpen, setIsUploadDrawerOpen] = useState(false);
  const books = [
    {
      id: 1,
      title: "The Great Gatsby",
      author: "F. Scott Fitzgerald",
      year: 1925,
      cover: "/cover.png",
    },
    {
      id: 2,
      title: "The Great Gatsby",
      author: "F. Scott Fitzgerald",
      year: 1925,
      cover: "/cover.png",
    },
    {
      id: 3,
      title: "The Great Gatsby",
      author: "F. Scott Fitzgerald",
      year: 1925,
      cover: "/cover.png",
    },
    {
      id: 4,
      title: "The Great Gatsby",
      author: "F. Scott Fitzgerald",
      year: 1925,
      cover: "/cover.png",
    },
    {
      id: 5,
      title: "The Great Gatsby",
      author: "F. Scott Fitzgerald",
      year: 1925,
      cover: "/cover.png",
    },
  ];

  return (
    <>
      <LibraryUploadDrawer
        open={isUploadDrawerOpen}
        onOpenChange={setIsUploadDrawerOpen}
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 2xl:grid-cols-4 gap-4">
        <div
          onClick={() => setIsUploadDrawerOpen(true)}
          className="border border-dashed rounded-md p-4 flex flex-col items-center justify-center gap-2 hover:bg-accent/50 transition-all cursor-pointer"
        >
          <UploadIcon size={16} className="text-muted-foreground" />
          <p className="text-sm text-muted-foreground">Upload your books</p>
        </div>
        {books.map((book) => (
          <Card
            key={book.id}
            className="group overflow-hidden transition-all rounded-md shadow-none hover:bg-accent/50 pt-0 gap-2 cursor-pointer"
          >
            {/* Book cover */}
            <CardContent className="p-0">
              <div className="relative h-40 w-full bg-muted">
                <Image
                  src={book.cover}
                  alt={book.title}
                  fill
                  className="object-contain"
                />
              </div>
            </CardContent>

            {/* Book info */}
            <CardHeader className="space-y-0 gap-0 px-4">
              <CardTitle className="line-clamp-2 text-base">
                {book.title}
              </CardTitle>
              <p className="text-sm text-muted-foreground">{book.author}</p>
            </CardHeader>

            <CardFooter className="px-4">
              <p className="text-xs text-muted-foreground">
                Published {book.year}
              </p>
            </CardFooter>
          </Card>
        ))}
      </div>
    </>
  );
};
