import { userStore } from "@/stores/user.store";
import { LuLoader2 } from "react-icons/lu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { auth } from "@/firebase";
import { CgGym } from "react-icons/cg";

const UserBox = () => {
  const { user, setUser } = userStore();
  const navigate = useNavigate();

  if (!user) return <LuLoader2 className="animate-spin" />;

  const onLogOut = () => {
    auth.signOut().then(() => {
      setUser(null);
      navigate("/auth");
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className="cursor-pointer">
          <AvatarImage src={user.photoURL!} />
          <AvatarFallback className="uppercase">
            {user.email![0]}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-80"
        align="start"
        alignOffset={11}
        forceMount
      >
        <div className="flex flex-col space-y-4 p-2">
          <p className="text-xs font-medium leading-none text-muted-foreground">
            {user?.email}
          </p>
          <div className="flex items-center gap-x-2">
            <div className="rounded-md bg-secondary p-1">
              <Avatar>
                <AvatarImage src={user.photoURL!} />
                <AvatarFallback className="uppercase">
                  {user.email![0]}
                </AvatarFallback>
              </Avatar>
            </div>
            <div className="space-y-1">
              <p className="line-clamp-1 text-sm">
                {user?.displayName ?? user?.email}
              </p>
            </div>
          </div>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem className="cursor-pointer">
            <CgGym className="w-5 h-5 mr-2" />
            <span>Gym</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            className="cursor-pointer bg-destructive text-white"
            onClick={onLogOut}
          >
            <LogOut className="w-5 h-5 mr-2" />
            <span>Log out</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserBox;
