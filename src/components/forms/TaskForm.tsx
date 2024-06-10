import { taskSchema } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useState } from "react";
import { userStore } from "@/stores/user.store";
import { toast } from "sonner";
import FillLoading from "../shared/FillLoading";

interface Props {
  title?: string;
  isEdit?: boolean;
  onClose?: () => void;
  handler: (values: z.infer<typeof taskSchema>) => Promise<void | null>;
}

const TaskForm = ({ title = "", handler, isEdit, onClose }: Props) => {
  const [isLoading, setIsLoading] = useState(false);
  const { user } = userStore();

  const form = useForm<z.infer<typeof taskSchema>>({
    resolver: zodResolver(taskSchema),
    defaultValues: { title },
  });

  const onSubmit = async function (values: z.infer<typeof taskSchema>) {
    if (!user) return null;
    setIsLoading(true);
    const promise = handler(values).finally(() => setIsLoading(false));

    toast.promise(promise, {
      loading: "Loading...",
      success: "Success",
      error: "Something went wrong",
    });
  };

  return (
    <>
      {isLoading && <FillLoading />}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    placeholder="Enter a task"
                    {...field}
                    disabled={isLoading}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-end mt-2">
            {isEdit && (
              <Button
                type="button"
                variant={"destructive"}
                className="h-10 w-fit mr-2"
                onClick={onClose}
              >
                Cancel
              </Button>
            )}
            <Button type="submit" className="h-10 w-fit" disabled={isLoading}>
              Submit
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
};

export default TaskForm;
