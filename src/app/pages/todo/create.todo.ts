// src/app/pages/todo/create.todo.ts

import { CreateTheConnectionLocal, LocalSyncData, MakeTheInstanceConceptLocal, PatcherStructure, PRIVATE, UpdateComposition } from "mftsccs-browser";
import { StatefulWidget } from "mftsccs-browser";
import { getLocalUserId } from "../user/login.service";

export class create extends StatefulWidget{
    before_render(): void {
        this.render();
    }

    after_render(): void {
        const userId: number = getLocalUserId();
        const order: number = 1;
        const titleInput = this.getElementById("title") as HTMLInputElement;
        const descriptionInput = this.getElementById("description") as HTMLInputElement;
        const idInput = this.getElementById("id") as HTMLInputElement;
        
        if(this.data){
            titleInput.value = this.data.title;
            descriptionInput.value = this.data.description;
            idInput.value = this.data.id;
        }
        
        const submitButton = this.getElementById("submit");
        if(submitButton){
            submitButton.onclick = async (ev: Event) => {
                ev.preventDefault();

                const titleValue = titleInput.value.trim();
                const descriptionValue = descriptionInput.value.trim();
                const taskId = idInput.value;

                if (!titleValue) {
                    console.warn("Title is empty, cannot create/update task");
                    return;
                }
    
                try {
                    if (taskId) {
                        console.log("Updating task ID:", taskId);
                        const patcher: PatcherStructure = new PatcherStructure();
                        patcher.compositionId = Number(taskId);
                        patcher.patchObject = {
                            title: titleValue,
                            description: descriptionValue
                        };
                        await UpdateComposition(patcher);
                        console.log("Task updated successfully");
                    } else {
                        await this.createNewTask(userId, titleValue, descriptionValue, order);
                    }
                } catch (error) {
                    console.error("Error creating/updating task:", error);
                }
            }
        }
    }

    /** 
     * Creates a new todo task and connects title, description, and status concepts
     */
    private async createNewTask(userId: number, titleValue: string, descriptionValue: string, order: number) {
        console.log("Creating new task...");

        try {
            const mainConcept = await MakeTheInstanceConceptLocal("the_todo", "", true, userId, PRIVATE);
            const titleConcept = await MakeTheInstanceConceptLocal("title", titleValue, false, userId, PRIVATE);
            const descriptionConcept = await MakeTheInstanceConceptLocal("description", descriptionValue, false, userId, PRIVATE);
            const statusConcept = await MakeTheInstanceConceptLocal("status", "pending", false, userId, PRIVATE);

            console.log("Concepts created:", {
                mainConceptId: mainConcept.id,
                titleConceptId: titleConcept.id,
                descriptionConceptId: descriptionConcept.id,
                statusConceptId: statusConcept.id
            });

            await CreateTheConnectionLocal(mainConcept.id, titleConcept.id, mainConcept.id, order, "", userId);
            await CreateTheConnectionLocal(mainConcept.id, descriptionConcept.id, mainConcept.id, order, "", userId);
            await CreateTheConnectionLocal(mainConcept.id, statusConcept.id, mainConcept.id, order, "", userId);

            await LocalSyncData.SyncDataOnline();
            console.log("Task created and synced successfully");
        } catch (error) {
            console.error("Failed to create new task:", error);
        }
    }

    getHtml(): string {
        let html = "";
        html =
        `<div class="container">
            <form>
                <div>
                    <input type= number id=id hidden>
                    <div class="formbody">
                        <label> Title </label>
                        <input type = text id="title" placeholder="Task title">
                    </div>
                    <div class="formbody">
                        <label> Description </label>
                        <textarea id="description" placeholder="Task description"></textarea>
                    </div>
                    <button class=" btn btn-primary" id="submit" type=submit>Submit</button>
                </div>
            </form>
        </div>`
        return html;
    }
}
