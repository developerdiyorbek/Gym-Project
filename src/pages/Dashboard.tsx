import TaskForm from "@/components/forms/TaskForm";
import FillLoading from "@/components/shared/FillLoading";
import TaskItem from "@/components/shared/TaskItem";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { db } from "@/firebase";
import { taskSchema } from "@/lib/validation";
import { TasksServie } from "@/service/task.service";
import { userStore } from "@/stores/user.store";
import { ITask } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { addMilliseconds, addMinutes, format } from "date-fns";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { useState } from "react";
import { LuBadgePlus } from "react-icons/lu";
import { toast } from "sonner";
import { z } from "zod";

const Dashboard = () => {
  const [open, setOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [isDelete, setIsDelete] = useState(false);

  const [currentTask, setCurrentTask] = useState<ITask | null>(null);

  const { user } = userStore();

  const { isPending, error, data, refetch } = useQuery({
    queryKey: ["Tasks"],
    queryFn: TasksServie.getTasks,
  });

  const onAdd = async ({ title }: z.infer<typeof taskSchema>) => {
    if (!user) return null;
    return addDoc(collection(db, "tasks"), {
      title,
      status: "unstarted",
      startTime: null,
      endTime: null,
      userId: user.uid,
    })
      .then(() => refetch())
      .finally(() => setOpen(false));
  };

  const onUpdate = async ({ title }: z.infer<typeof taskSchema>) => {
    if (!user) return null;
    if (!currentTask) return null;
    const ref = doc(db, "tasks", currentTask.id);
    return updateDoc(ref, { title })
      .then(() => refetch())
      .finally(() => setIsEdit(false));
  };

  const onEdit = (task: ITask) => {
    setIsEdit(true);
    setCurrentTask(task);
  };

  const onDelete = async (id: string) => {
    setIsDelete(true);
    const promise = deleteDoc(doc(db, "tasks", id))
      .then(() => refetch())
      .finally(() => setIsDelete(false));
    toast.promise(promise, {
      loading: "loading...",
      success: "Successfully deleted",
      error: "Something went wrong",
    });
  };

  const getFormatDate = (time: number) => {
    const date = addMilliseconds(new Date(0), time);
    const formattedDate = format(
      addMinutes(date, date.getTimezoneOffset()),
      "HH:mm:ss"
    );
    return formattedDate;
  };

  return (
    <>
      <div className="max-w-6xl mt-10 mx-auto flex items-center  px-2">
        <div className="grid grid-cols-1 md:grid-cols-2 w-full gap-8 items-center">
          <div className="flex flex-col space-y-3 w-full">
            <div className="w-full p-4 rounded-md flex justify-between bg-gradient-to-t from-background to-secondary">
              <div className="text-2xl font-bold">Trainings</div>
              <Button size={"icon"} onClick={() => setOpen(true)}>
                <LuBadgePlus size={20} />
              </Button>
            </div>
            <Separator />
            <div className="w-full p-4 rounded-md flex justify-between bg-gradient-to-b from-background to-secondary relative min-h-[200px]">
              {(isPending || isDelete) && <FillLoading />}
              {error && (
                <div className="text-red-600 text-lg">{error.message}</div>
              )}

              {data && (
                <div className="flex flex-col space-y-3 w-full">
                  {!isEdit &&
                    data.tasks.map((task) => (
                      <TaskItem
                        key={task.id}
                        task={task}
                        onEdit={() => onEdit(task)}
                        onDelete={() => onDelete(task.id)}
                        refetch={refetch}
                      />
                    ))}
                  {isEdit && (
                    <TaskForm
                      title={currentTask?.title}
                      isEdit
                      onClose={() => setIsEdit(false)}
                      handler={
                        onUpdate as (
                          values: z.infer<typeof taskSchema>
                        ) => Promise<void | null>
                      }
                    />
                  )}
                </div>
              )}
            </div>
          </div>
          <div className="flex flex-col space-y-3  w-full">
            <div className="p-4 rounded-md bg-gradient-to-tr from-green-500 to-background relative h-24">
              <div className="text-xl md:text-2xl font-bold">Total week</div>
              {isPending ? (
                <FillLoading />
              ) : (
                data && (
                  <>
                    <div className="text-2xl md:text-3xl font-bold">
                      {getFormatDate(data?.weekTotal)}
                    </div>
                  </>
                )
              )}
            </div>
            <div className="p-4 rounded-md bg-gradient-to-tr from-secondary to-background relative h-24">
              <div className="text-xl md:text-2xl font-bold">Total month</div>
              {isPending ? (
                <FillLoading />
              ) : (
                data && (
                  <>
                    <div className="text-2xl md:text-3xl font-bold">
                      {getFormatDate(data?.monthTotal)}
                    </div>
                  </>
                )
              )}
            </div>
            <div className="p-4 rounded-md bg-gradient-to-tr from-destructive to-background relative h-24">
              <div className="text-xl md:text-2xl font-bold">Total time</div>
              {isPending ? (
                <FillLoading />
              ) : (
                data && (
                  <>
                    <div className="text-2xl md:text-3xl font-bold">
                      {getFormatDate(data?.total)}
                    </div>
                  </>
                )
              )}
            </div>
          </div>
        </div>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger></DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create a new task</DialogTitle>
          </DialogHeader>
          <Separator />
          <TaskForm
            handler={
              onAdd as (
                values: z.infer<typeof taskSchema>
              ) => Promise<void | null>
            }
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Dashboard;
