// src/app/pages/todo/list.todo.ts

import { DeleteConceptById, GetCompositionListListener, NORMAL, PatcherStructure, UpdateComposition } from "mftsccs-browser";
import { StatefulWidget } from "mftsccs-browser";
import { getLocalUserId } from "../user/login.service";

export class list extends StatefulWidget{
    todos: any = [];
    inpage: number = 10;
    page: number = 1;

    before_render(): void {
        const userId: number = getLocalUserId();
        GetCompositionListListener("the_todo", userId, this.inpage, this.page, NORMAL).subscribe((output: any)=>{
            this.todos = output;
            this.render();
        })
    }

    after_render() {
        console.log("Rendering task list...");
        const tableElement = this.getElementById("mainbody");
        if (!tableElement) return;

        tableElement.innerHTML = ""; // Clear previous rows

        for (const taskWrapper of this.todos) {
            const task = taskWrapper.the_todo;
            if (!task?.id) continue;

            const row = document.createElement("tr");

            // Cells
            const titleCell = document.createElement("td");
            const descriptionCell = document.createElement("td");
            const statusCell = document.createElement("td");
            const delCell = document.createElement("td");
            const editCell = document.createElement("td");
            const statusButtonCell = document.createElement("td");

            titleCell.textContent = task.title;
            descriptionCell.textContent = task.description;
            statusCell.textContent = task.status;

            // Buttons
            const deleteButton = this.createButton("Delete", async () => {
                try {
                    await DeleteConceptById(task.id);
                    console.log("Task deleted:", task.id);
                    this.before_render();
                } catch (error) {
                    console.error("Failed to delete task:", error);
                }
            });

            const editButton = this.createButton("Edit", () => {
                this.data = { id: task.id, title: task.title, description: task.description };
                this.notify();
            });

            const toggleStatusButton = this.createButton("Toggle Status", async () => {
                const newStatus = task.status === "pending" ? "completed" : "pending";
                console.log(`Changing status for task ID: ${task.id} from ${task.status} → ${newStatus}`);
                try {
                    const patcher = new PatcherStructure();
                    patcher.compositionId = Number(task.id);
                    patcher.patchObject = { status: newStatus };
                    await UpdateComposition(patcher);
                    console.log("Status updated successfully");
                    this.before_render();
                } catch (error) {
                    console.error("Failed to update status:", error);
                }
            });

            // Append buttons to cells
            delCell.appendChild(deleteButton);
            editCell.appendChild(editButton);
            statusButtonCell.appendChild(toggleStatusButton);

            // Append cells to row
            row.append(titleCell, descriptionCell, statusCell, delCell, editCell, statusButtonCell);

            // Append row to table
            tableElement.appendChild(row);
        }
    }

    /** Helper to create buttons consistently */
    private createButton(label: string, onClick: () => void): HTMLButtonElement {
        const btn = document.createElement("button");
        btn.classList.add("btn", "btn-primary");
        btn.textContent = label;
        btn.onclick = onClick;
        return btn;
    }

    getHtml(): string {
        let html = "";

        html = 
        `<div>
            <table>
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Description</th>
                        <th>Status</th>
                        <th>Delete</th>
                        <th>Edit</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody id= mainbody></tbody>
            </table>
        </div>`
        return html;
    }
}