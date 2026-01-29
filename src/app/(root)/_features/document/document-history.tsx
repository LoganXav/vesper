import { FileIcon } from "lucide-react";

export const DocumentHistory = () => {
  const documentHistory = [
    {
      id: 1,
      title: "Mathematics 101 Exam Questions",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 2,
      title: "Physics Week 1 Lesson Notes",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 3,
      title: "Chemistry Week 2 Lesson Notes",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 4,
      title: "Biology Week 3 Lesson Notes",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 5,
      title: "History Week 4 Lesson Notes",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 6,
      title: "English Week 5 Lesson Notes",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 7,
      title: "Geography Week 6 Lesson Notes",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 8,
      title: "Economics Week 7 Lesson Notes",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  return (
    <div className="flex flex-col gap-1">
      {documentHistory.map((document) => (
        <div
          key={document.id}
          className="flex items-center gap-2 p-2 rounded-md hover:bg-accent transition-colors cursor-pointer"
        >
          <FileIcon className="size-4" />
          <h2 className="line-clamp-1 text-ellipsis overflow-hidden">
            {document.title}
          </h2>
        </div>
      ))}
    </div>
  );
};
