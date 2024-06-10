import { Button } from "@/components/ui/button";
import { featuredIcons, programs } from "@/constants";

import men from "@/assets/men.png";

import { Card } from "@/components/ui/card";
import { FaArrowRight } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { userStore } from "@/stores/user.store";
import { CgGym } from "react-icons/cg";
import { LuLogOut } from "react-icons/lu";
import { auth } from "@/firebase";

const Home = () => {
  const { user, setUser } = userStore();
  const navigate = useNavigate();

  const onLogOut = () => {
    auth.signOut().then(() => {
      setUser(null);
      navigate("/auth");
    });
  };

  return (
    <>
      <div className="w-full py-10 flex px-2  items-center gap-5 md:gap-7 xl:gap-0 flex-col-reverse xl:flex-row md:justify-center">
        <div className="max-w-xl  flex h-full flex-col justify-center text-center xl:text-left">
          <h1 className="text-2xl md:text-5xl xl:text-8xl font-semibold uppercase">
            Workout with me
          </h1>
          <p className="text-muted-foreground md:text-xl xl:text-lg">
            A huge selection of health and fitness content , healthy recipes and
            transformation stories to help you get fit and stay fit!
          </p>
          {user ? (
            <div className="flex  gap-4 items-center mx-auto xl:mx-0">
              <Link to={"/dashboard"}>
                <Button className="w-fit mt-6 font-bold h-12" size={"lg"}>
                  <span>Go to gym</span>
                  <CgGym className="h-5 w-5 ml-2" />
                </Button>
              </Link>
              <Button
                className="w-fit mt-6 font-bold h-12"
                variant={"destructive"}
                size={"lg"}
                onClick={onLogOut}
              >
                <span>LogOut</span>
                <LuLogOut className="h-5 w-5 ml-2" />
              </Button>
            </div>
          ) : (
            <Link to={"/auth"}>
              <Button className="w-fit mt-6 font-bold h-12" size={"lg"}>
                Join club now
              </Button>
            </Link>
          )}

          <div className="mt-10 md:mt-16 xl:mt-24">
            <p className="text-muted-foreground mb-5">AS FEATURED IN</p>
            <div className="flex flex-wrap items-center gap-4 mt-2 justify-center xl:justify-start">
              {featuredIcons.map((Icon, index) => (
                <Icon key={index} className="w-10 h-10 md:w-12 md:h-12" />
              ))}
            </div>
          </div>
        </div>
        <img src={men} alt="men Image" className="w-1/3 md:w-1/4" />
      </div>

      <div className="container max-w-5xl mx-auto">
        <h1 className="text-2xl md:text-4xl md:text-center xl:text-left">
          Not Sure where to start
        </h1>
        <p className="mt-2 text-muted-foreground md:text-center xl:text-left">
          Programs offer day-to-day guidance on an interactive calendar to keep
          you track.
        </p>

        <div className="grid grid-cols-1  md:grid-cols-2 xl:grid-cols-3 gap-4 my-8">
          {programs.map((item, index) => (
            <Card key={index} className="p-8 relative cursor-pointer group">
              <h3 className="text-lg">{item.title}</h3>
              <p className="text-muted-foreground text-sm mt-2">{item.descr}</p>
              <Button
                size={"icon"}
                variant={"ghost"}
                className="absolute right-2 top-1/2 group-hover:translate-x-1 transition-transform"
              >
                <FaArrowRight />
              </Button>
            </Card>
          ))}
        </div>
      </div>
    </>
  );
};

export default Home;
