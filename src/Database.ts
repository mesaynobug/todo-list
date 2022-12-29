import { Task } from "./Task";
/**
 * Stores tasks
 */
export interface Database {
    /**
     * Creates a new task object
     * @param desc Text description of the task
     * @param date Optional due date of task
     */
    create(desc: string, date?: string): Promise<number>;
    /**
     * Returns the task associated with the specified id
     * @param id The id of the task to return
     */
    read(id: number): Promise<Task>;
    /**
     * Modifies an existing task's attributes
     * @param id The id of the task to update
     * @param task The updated task object
     */
    update(id: number, task: Task): Promise<boolean>;
    /**
     * Permanently deletes the specified task
     * @param id Id of the task to delete
     */
    delete(id: number): Promise<boolean>;
    /**
     * Returns an array containing all stored task ids
     */
    list(): Promise<number[]>;
    /**
     * Sorts the task list by various attributes (due,id)
     * @param input The attribute to sort by
     */
    taskSort(input: string): void;
    /**
     * Add a tag to the task. Returns 1 if successful, 0 otherwise
     * @param tag The tag to add
     * @param id The id of the task to add a tag to
     */
    addTag(id: number, tag: string): Promise<number>;
    /**
     * Add a tag to the task. Returns 1 if successful, 0 otherwise
     * @param tag The tag to add
     * @param id The id of the task to remove a tag from
     */
    removeTag(id: number, tag: string): Promise<number>;
}
