const Message = ({
  id,
  img,
  type,
  userName,
  date,
  message,
  replay,
  getDataFromReply,
}) => {
  return (
    <>
      {replay && (
        <div className="flex gap-2 pl-5 items-center">
          <div className="border-l-2 border-t-2 border-neutral-500 w-8 h-4"></div>
          <img src={replay.userImg} className="w-4 h-4 rounded-full" />
          <span
            className={`${
              replay.type === "owner"
                ? "text-white/50"
                : replay.type === "moderator"
                ? "text-yellow-500/50"
                : "text-green-500/50"
            } text-md`}
          >
            {replay.userName}
          </span>
          <span className="text-white/90 text-sm">{replay.message}</span>
        </div>
      )}
      <div key={id} className="flex gap-2">
        <img src={img} className="w-10 h-10 rounded-full" />
        <div>
          <div className="text-neutral-400 flex gap-2 items-center">
            <span
              className={`${
                type === "owner"
                  ? "text-white"
                  : type === "moderator"
                  ? "text-yellow-400"
                  : "text-green-400"
              } text-md`}
            >
              <span
                onClick={() =>
                  getDataFromReply(id, img, type, userName, date, message)
                }
              >
                {userName}
              </span>
            </span>
            <div className="text-xs">{date}</div>
          </div>
          <div className="text-md">{message}</div>
        </div>
      </div>
    </>
  );
};

export default Message;
