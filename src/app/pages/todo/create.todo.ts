// src/app/pages/todo/create.todo.ts

import { CreateTheConnectionLocal, LocalSyncData, MakeTheInstanceConceptLocal, PatcherStructure, PRIVATE, UpdateComposition } from "mftsccs-browser";
import { StatefulWidget } from "mftsccs-browser";
import { getLocalUserId } from "../user/login.service";

export class create extends StatefulWidget{
    before_render(): void {
        this.render();
    }

    after_render(): void {
        let userId: number = getLocalUserId();
        let order: number = 1;
        let title = this.getElementById("title") as HTMLInputElement;
        let description = this.getElementById("description") as HTMLInputElement;
        let id = this.getElementById("id") as HTMLInputElement;
        
        if(this.data){
            console.log("Editing existing task:", this.data);
            title.value = this.data.title;
            description.value = this.data.description;
            id.value = this.data.id;
        }
        
        let submitButton = this.getElementById("submit");
        
        if(submitButton){
            submitButton.onclick = (ev: Event) => {
                ev.preventDefault();
    
                if(id.value){
                    console.log("Updating task with ID:", id.value);
                    let patcherStructure: PatcherStructure = new PatcherStructure();
                    patcherStructure.compositionId = Number(id.value);
                    patcherStructure.patchObject = {
                        "title": title.value,
                        "description": description.value,
                    }
                    UpdateComposition(patcherStructure).then(() => {
                        console.log("Task updated successfully");
                    });
                } else{
                    console.log("Creating new task...");
                    MakeTheInstanceConceptLocal("the_todo", "", true,userId,PRIVATE).then((mainconcept)=> {
                        MakeTheInstanceConceptLocal("title", title.value,false, userId, PRIVATE).then((title_concept)=>{
                            MakeTheInstanceConceptLocal("description", description.value, false, userId, PRIVATE).then((desc_concept) => {
                                MakeTheInstanceConceptLocal("status", "pending", false, userId, PRIVATE).then((status_concept) => {
                                    CreateTheConnectionLocal(mainconcept.id, title_concept.id, mainconcept.id, order, "", userId).then(()=>{
                                        CreateTheConnectionLocal(mainconcept.id, desc_concept.id, mainconcept.id, order, "", userId).then(()=>{
                                            CreateTheConnectionLocal(mainconcept.id, status_concept.id, mainconcept.id, order, "", userId).then(()=>{
                                                LocalSyncData.SyncDataOnline().then(() => {
                                                    console.log("Data synced successfully");
                                                });
                                            })
                                        })
                                    })
                                });
                            });
                        });
                    });
                }
            }
        }

    }

    /**
     * @returns returns a form that takes in title and description for the todo item.
     */
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
