interface AvatarProps {
  src?: string;
  name?: string;
  className?: string;
}

// User avatar with the same ui-avatars fallback used across the app
export default function Avatar({ src, name = "User", className = "w-10 h-10" }: AvatarProps) {
  return (
    <img
      src={src || `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`}
      alt={name}
      className={`${className} rounded-full object-cover shrink-0 bg-gray-800`}
    />
  );
}
