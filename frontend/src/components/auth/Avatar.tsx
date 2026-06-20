import React from 'react';

// 1. Define the structural contract for the component props
interface AvatarProps {
  name: string;
}

export default function Avatar({ name }: AvatarProps): React.JSX.Element {
  // Split name by spaces and clean up whitespace
  const nameParts: string[] = name.trim().split(/\s+/);
  
  let initials: string = '';
  
  if (nameParts.length === 1 && nameParts[0]) {
    // If only one name is provided, take its first character safely
    initials = nameParts[0].charAt(0);
  } else if (nameParts.length > 1) {
    // Safely extract from first element and last element
    const firstInitial = nameParts[0]?.charAt(0) || '';
    const lastInitial = nameParts[nameParts.length - 1]?.charAt(0) || '';
    console.log(lastInitial)
    initials = `${firstInitial}${lastInitial}`;
  }

  return (
    <div className="avatar-circle">
      {initials.toUpperCase()}
    </div>
  );
}
