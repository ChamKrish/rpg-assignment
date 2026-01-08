import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class BlogModel {
  @Field(() => ID)
  id: string;

  @Field()
  title: string;

  @Field()
  content: string;

  @Field()
  createdAt: Date;

  @Field()
  authorId: string;

  @Field()
  authorName: string;
}
