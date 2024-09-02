import { Entity, PrimaryKey, Property,ManyToOne } from '@mikro-orm/core';
import { ObjectId } from '@mikro-orm/mongodb';
import { User } from "../user/user.entity";

@Entity()
export class Task {
  @PrimaryKey()
  _id!: ObjectId;

  @Property()
  title!: string;

  @Property({ default: '' }) // Imposta un valore di default per content
  content!: string;

  @Property({ default: false })
  completed: boolean = false;

  @Property({ onCreate: () => new Date() })
  createdAt!: Date;

  @Property({ onCreate: () => new Date(), onUpdate: () => new Date() })
  updatedAt!: Date;

  @ManyToOne(() => User)
  user!: User;

}