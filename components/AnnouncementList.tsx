interface Announcement {
  id: number;
  title: string;
  content: string;
  image_path?: string;
  created_at: string;
  created_by: number;
  creator: {
    user_id: number;
    name: string;
  };
}

const AnnouncementList = ({ data }: { data: Announcement[] }) => {
  return (
    <div className="flex flex-col gap-6">
      {data?.map((announcement, index) => (
        <div
          key={announcement.id ?? `doc-${index}`}
          className="p-4 border border-gray-200 rounded-lg shadow-sm"
        >
          <div className="flex flex-col gap-2 mb-6">
            <h2 className="text-2xl font-semibold">{announcement.title}</h2>
            <p className="text-sm text-gray-500">
              From: Admin &nbsp;|&nbsp; Date:
              {new Date(announcement.created_at).toLocaleDateString()}
            </p>
          </div>
          <p className="text-slate-700 text-lg my-4">{announcement.content}</p>
          {announcement.image_path && (
            <img
              src={announcement.image_path}
              alt={announcement.title}
              className="max-w-full h-auto rounded-md"
            />
          )}
        </div>
      ))}
    </div>
  );
};

export default AnnouncementList;
