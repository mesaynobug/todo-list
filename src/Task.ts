import moment from "moment";
/**
 * Object representing a task in the to-do list
 */
export class Task {
    /** A text description of the task */
    private desc: string;
    /** The id of the task */
    private id: number;
    /** Whether the task has been completed or not */
    private complete: boolean;
    /** The due date for the task in 'MMMM Do YYYY, h:mm' format */
    private date: string;
    /** The importance of the task */
    private priority: number;
    /** Keywords to associate the task with */
    private tags: string[];
    /** Whether or not the task is archived */
    private archived: boolean;
    /**
     * Builds a new task object
     * @param desc The task description
     * @param id The task id
     * @param date The task due date
     * @param complete The task completion status
     */
    constructor(desc: string, id: number, date: string, complete?: boolean) {
        this.desc = desc;
        this.id = id;
        this.complete = false;
        if (complete !== undefined) {
            this.complete = complete;
        }
        this.date = date;
        this.priority = 1;
        this.tags = [];
        this.archived = false;
    }
    /**
     * Returns the task description
     */
    getDesc() {
        return this.desc;
    }
    /**
     * Returns the task id
     */
    getId() {
        return this.id;
    }
    /**
     * Returns the completion status of the task
     */
    getComplete() {
        return this.complete;
    }
    /**
     * Returns the task date in 'MMMM Do YYYY, h:mm' format
     */
    getDate() {
        return this.date;
    }
    /**
     * Returns the task priority
     */
    getPriority() {
        return this.priority;
    }
    /**
     * Returns task's tags as an array
     */
    getTags() {
        return this.tags;
    }
    /**
     *  Returns the archival status
     */
    getArchived() {
        return this.archived;
    }
    /**
     * Sets the task description
     * @param desc The new description
     */
    setDesc(desc: string) {
        this.desc = desc;
    }
    /**
     * Sets the task id
     * @param id The new id
     */
    setId(id: number) {
        this.id = id;
    }
    /**
     * Sets the task completion status
     * @param complete The new completion status
     */
    setComplete(complete: boolean) {
        this.complete = complete;
    }
    /**
     * Sets the task date
     * @param date The new date in 'MMMM Do YYYY, h:mm' format
     */
    setDate(date: string) {
        this.date = date;
    }
    /**
     * Sets the task priority
     * @param priority The priority of the task
     */
    setPriority(priority: number) {
        this.priority = priority;
    }
    /**
     * Sets the task tags.
     * @param tags The array of tags
     */
    setTags(tags: string[]) {
        this.tags = tags;
    }
    /**
     * Set the task's archival status
     * @param archived The archival status of the task
     */
    setArchived(archived: boolean) {
        this.archived = archived;
    }
    /**
     * Add a tag to the task. Returns 1 if successful, 0 otherwise
     * @param addTag The tag to add
     */
    addTag(addTag: string) {
        if (this.tags.find((tag) => tag === addTag) == undefined) {
            this.tags.push(addTag);
            return 1;
        }
        return 0;
    }
    /**
     * Remove a tag from the task. Returns 1 if successful, 0 otherwise
     * @param deleteTag The tag to delete
     */
    removeTag(deleteTag: string) {
        if (!(this.tags.find((tag) => tag === deleteTag) == undefined)) {
            this.tags = this.tags.filter((tag) => tag !== deleteTag);
            return 1;
        }
        return 0;
    }
    /**
     * Outputs a string formatted for use in ListCommand
     */
    toString() {
        return (
            this.id +
            ": " +
            this.desc +
            " (" +
            this.tags.toString() +
            ") " +
            " | Complete: " +
            this.complete +
            " | Priority: " +
            this.priority +
            " | Due: " +
            this.date +
            " (" +
            moment().to(moment(this.getDate(), "MMMM Do YYYY, h:mm a")) +
            ")" +
            "<br>"
        );
    }
}
