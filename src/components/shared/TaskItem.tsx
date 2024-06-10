import { Card } from "../ui/card";
import { MdOutlineTaskAlt } from "react-icons/md";
import { HiStatusOnline } from "react-icons/hi";
import { Button } from "../ui/button";
import { CiPause1, CiPlay1 } from "react-icons/ci";
import { Edit2, Trash } from "lucide-react";
import { ITask, ITaskData } from "@/types";
import { RxReload } from "react-icons/rx";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/firebase";
import FillLoading from "./FillLoading";
import { QueryObserverResult } from "@tanstack/react-query";

interface Props {
  task: ITask;
  onEdit: () => void;
  refetch: () => Promise<QueryObserverResult<ITaskData, Error>>;
  onDelete: () => void;
}

const TaskItem = ({ task, onEdit, onDelete, refetch }: Props) => {
  const [loading, setLoading] = useState(false);

  const activeColor = useMemo(() => {
    switch (task.status) {
      case "unstarted":
        return "text-blue-500";
      case "in_progress":
        return "text-green-500";
      case "paused":
        return "text-red-500";
    }
  }, [task.status]);

  const onStart = async () => {
    setLoading(true);
    const ref = doc(db, "tasks", task.id);
    try {
      await updateDoc(ref, {
        status: "in_progress",
        startTime: Date.now(),
      });
      refetch();
    } catch (err) {
      toast.error("An error occured");
    } finally {
      setLoading(false);
    }
  };

  const onPause = async () => {
    setLoading(true);
    const ref = doc(db, "tasks", task.id);
    try {
      const elapsed = task.startTime ? Date.now() - task.startTime : 0;
      const newTotalTime = (task.totalTime || 0) + elapsed;
      await updateDoc(ref, {
        status: "paused",
        endTime: Date.now(),
        totalTime: newTotalTime,
      });
      refetch();
    } catch (error) {
      toast.error("An error occured");
    } finally {
      setLoading(false);
    }
  };

  const renderBtns = () => {
    switch (task.status) {
      case "unstarted":
        return (
          <Button
            variant={"ghost"}
            size={"icon"}
            className="w-8 h-8"
            onClick={onStart}
          >
            <CiPlay1 className="w-5 h-5 text-indigo-500" />
          </Button>
        );
      case "in_progress":
        return (
          <Button
            variant={"ghost"}
            size={"icon"}
            className="w-8 h-8"
            onClick={onPause}
          >
            <CiPause1 className="w-5 h-5 text-indigo-500" />
          </Button>
        );
      case "paused":
        return (
          <Button
            variant={"ghost"}
            size={"icon"}
            className="w-8 h-8"
            onClick={onStart}
          >
            <RxReload className="w-5 h-5 text-indigo-500" />
          </Button>
        );
    }
  };

  return (
    <Card className="w-full p-4 rounded flex justify-between shadow-md items-center relative">
      {loading && <FillLoading />}
      <div className="flex gap-1  items-center  w-full">
        <MdOutlineTaskAlt className="text-blue-500" size={18} />
        <span className="capitalize">{task.title}</span>
      </div>
      <div className="flex item-center gap-1">
        <HiStatusOnline className={activeColor} />
        <span className="capitalize text-sm">{task.status}</span>
      </div>
      <div className="flex item-center gap-1 justify-self-end ml-1">
        {renderBtns()}
        <Button
          variant={"secondary"}
          size={"icon"}
          className="w-8 h-8"
          onClick={onEdit}
        >
          <Edit2 className="w-5 h-5 " />
        </Button>
        <Button
          variant={"destructive"}
          size={"icon"}
          className="w-8 h-8"
          onClick={onDelete}
        >
          <Trash className="w-5 h-5 text-white" />
        </Button>
      </div>
    </Card>
  );
};

export default TaskItem;
