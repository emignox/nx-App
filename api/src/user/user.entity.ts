import { OneToMany, PrimaryKey, Collection,Entity, Property } from "@mikro-orm/core";
import {Task} from "../notebook/notebook.entity";
import { ObjectId } from '@mikro-orm/mongodb';


@Entity()
export class User {
    @PrimaryKey()
    _id!: ObjectId;

    @Property()
    name!: string;

    @Property()
    email!: string;

    @Property()
    password!: string;

    @OneToMany(() => Task, task => task.user)
     notebook = new Collection<Task>(this)
}