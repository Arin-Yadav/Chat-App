import dayjs from "dayjs"; // lightweight date library

const MessageBubble = ({ message, currentUser }) => {
  const isSelf = message.sender === currentUser;
  const time = dayjs(message.createdAt).format("h:mm A"); // e.g. 2:15 PM

  return (
    <div
      className={`max-w-xs p-3 mb-2 rounded-lg shadow ${
        isSelf
          ? "bg-blue-500 text-white ml-auto text-right"
          : "bg-gray-200 text-black mr-auto text-left"
      }`}
    >
      <p className="wrap-break-word">{message.text}</p>
      <div className="flex justify-between items-center mt-1 text-xs opacity-70">
        <span>{isSelf ? "You" : message.sender}</span>
        <span>{time}</span>
      </div>
    </div>
  );
};

export default MessageBubble;
