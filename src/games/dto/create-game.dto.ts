import { IsNotEmpty } from "class-validator";

export class CreateGameDto {
  @IsNotEmpty()
  name: string;
  
  @IsNotEmpty()
  image: string;
  
  @IsNotEmpty()
  category_id: number;
}
