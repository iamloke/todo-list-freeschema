// src/app/pages/todo/wrapper.todo.ts

import { StatefulWidget } from 'mftsccs-browser'
import { create } from "./create.todo";
import { list } from "./list.todo";
import './todo.style.css';

export class todo extends StatefulWidget{
    mount_child(){
        let formWidget = this.getElementById("formWidget");
        let tableWidget = this.getElementById("tableWidget");
        let creating =new create();
        let listing = new list();

        if(formWidget){
            this.childWidgets.push(creating);
            creating.mount(formWidget);
        }
        if(tableWidget){
            listing.dataChange((value: any)=>{
                this.UpdateChildData(value, creating);
            });
            this.childWidgets.push(listing);
            listing.mount(tableWidget);
        }
    }

    getHtml(): string {
        let html = "";

        html = `<div class="container">
                    <div id= "formWidget"></div>
                </div>
                <div class="flex-container">
                    <div id ="tableWidget"></div>
                </div>`
        return html;
    }
}
