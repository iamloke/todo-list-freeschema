// src/app/pages/todo/list.todo.ts

import { DeleteConceptById, GetCompositionListListener, NORMAL, PatcherStructure, UpdateComposition } from "mftsccs-browser";
import { StatefulWidget } from "mftsccs-browser";
import { getLocalUserId } from "../user/login.service";

export class list extends StatefulWidget{
    todos: any;
    inpage: number= 10;
    page: number = 1;
    linker: string = "console_folder_s";

    before_render(): void {
        let userId: number = getLocalUserId();
        GetCompositionListListener("the_todo", userId, this.inpage, this.page, NORMAL).subscribe((output: any)=>{
            this.todos = output;
            this.render();
        })
    }

    after_render() {
        let tableElement = this.getElementById("mainbody");
        if(tableElement){
            if(this.todos.length > 0){
                for(let i= 0; i< this.todos.length; i++){
                    let id = this.todos[i].the_todo?.id;

                    if(id){
                        let row = document.createElement("tr");
                        let col1 = document.createElement("td");
                        let col2 = document.createElement("td");
                        let col3 = document.createElement("td");
                        let col4 = document.createElement("td");
                        let col5 = document.createElement("td");
                        let col6 = document.createElement("td");
                        
                        let title = document.createElement("span");
                        let titleValue = this.todos[i].the_todo.title
                        title.innerHTML = titleValue;
                        let description = document.createElement("span");
                        let descriptionValue = this.todos[i].the_todo.description
                        description.innerHTML = descriptionValue;
                        let status = document.createElement("span");
                        let statusValue = this.todos[i].the_todo.status;
                        status.innerHTML = statusValue;
                                        
                        let del = document.createElement("button");
                        del.setAttribute('class', 'btn btn-primary');
                        del.setAttribute('padding', "10px");
                        del.id = this.todos[i].the_todo.id;
                        del.innerHTML = "Delete";
                        del.onclick = () =>{
                            if(id){
                                DeleteConceptById(id).then(()=>{
                                    console.log("Task deleted:", id);
                                    this.before_render();
                                });
                            }
                        }

                        let edit = document.createElement("button");
                        edit.setAttribute('class', 'btn btn-primary');
                        edit.setAttribute('padding', "10px");
                        edit.id = this.todos[i].the_todo.id;
                        edit.innerHTML = "edit";
                        edit.onclick = () =>{
                            this.data = {
                                "id": edit.id,
                                "title": titleValue,
                                "description": descriptionValue
                            }                            
                            this.notify();
                        }

                        let changestatus = document.createElement("button");
                        changestatus.setAttribute('class', 'btn btn-primary');
                        changestatus.setAttribute('padding', "10px");
                        changestatus.id = this.todos[i].the_todo.id;
                        changestatus.innerHTML = "change status";
                        changestatus.onclick = () =>{
                            let newStatus = statusValue === "pending" ? "completed" : "pending";

                            let patcher = new PatcherStructure();
                            patcher.compositionId = id;
                            patcher.patchObject = {
                                status: newStatus
                            };

                            UpdateComposition(patcher).then(() => {
                                console.log(`Status updated to "${newStatus}" successfully for task ID: ${id}`);
                            });
                        }

                        col1.append(title);
                        col2.append(description);
                        col3.append(status);
                        col4.append(del);
                        col5.append(edit);
                        col6.append(changestatus);
                
                        row.appendChild(col1);
                        row.appendChild(col2);
                        row.appendChild(col3);
                        row.appendChild(col4);
                        row.appendChild(col5);
                        row.appendChild(col6);
                        tableElement.append(row);
                    }
                }
            }
        }
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