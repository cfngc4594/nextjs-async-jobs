import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogIn, LogOutIcon } from "lucide-react";
import { auth, signIn, signOut } from "@/lib/auth";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const handleSignIn = async () => {
  "use server";
  await signIn();
};

const handleSignOut = async () => {
  "use server";
  await signOut();
};

interface UserAvatarIconProps {
  image?: string | null;
  name?: string | null;
  className?: string;
}

const UserAvatarIcon = ({ image, name, className }: UserAvatarIconProps) => {
  return (
    <Avatar className={cn("h-8 w-8 cursor-pointer", className)}>
      <AvatarImage src={image ?? undefined} />
      <AvatarFallback>{name?.charAt(0) ?? "U"}</AvatarFallback>
    </Avatar>
  );
};

interface UserProfileInfoProps {
  name?: string | null;
  email?: string | null;
}

const UserProfileInfo = ({ name, email }: UserProfileInfoProps) => {
  return (
    <div className="grid flex-1 text-left text-sm leading-tight">
      <span className="truncate font-semibold">{name ?? "undefined"}</span>
      <span className="truncate text-xs">{email ?? "undefined"}</span>
    </div>
  );
};

export const UserAvatar = async () => {
  const session = await auth();
  const user = session?.user;
  const isSignedIn = !!user;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <UserAvatarIcon image={user?.image} name={user?.name} />
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
        align="end"
        sideOffset={8}
      >
        {!isSignedIn ? (
          <DropdownMenuGroup>
            <DropdownMenuItem onClick={handleSignIn}>
              <LogIn />
              Sign In
            </DropdownMenuItem>
          </DropdownMenuGroup>
        ) : (
          <>
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <UserAvatarIcon image={user.image} name={user.name} />
                <UserProfileInfo name={user.name} email={user.email} />
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={handleSignOut}>
                <LogOutIcon />
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export const UserAvatarSkeleton = () => {
  return <Skeleton className="h-8 w-8 rounded-full" />;
};
