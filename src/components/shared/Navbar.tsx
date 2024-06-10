import { NavLinks } from "@/constants";
import { ModeToggle } from "./mode-toggle";
import { Link } from "react-router-dom";
import { Button } from "../ui/button";
import { userStore } from "@/stores/user.store";
import UserBox from "./UserBox";
import workoutIcon from "@/assets/workout.png";

const Navbar = () => {
  const { user } = userStore();

  return (
    <div className="w-full py-3 border-b sticky inset-0 z-50 bg-background">
      <div className="container max-w-6xl mx-auto h-full flex justify-between items-center">
        <Link to={"/"}>
          <img src={workoutIcon} alt="logo" className="w-[40px] md:w-[55px]" />
        </Link>
        <div className="flex items-center gap-3">
          {NavLinks.map((nav) => (
            <a
              href={nav.path}
              key={nav.path}
              className="font-medium hover:underline duration-100 hidden md:block"
            >
              {nav.label}
            </a>
          ))}
          <ModeToggle />
          {user ? (
            <UserBox />
          ) : (
            <Link to={"/auth"}>
              <Button variant={"secondary"}>Join Free</Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
