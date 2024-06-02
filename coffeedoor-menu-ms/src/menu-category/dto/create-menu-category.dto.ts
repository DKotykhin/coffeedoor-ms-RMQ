export class CreateMenuCategoryDto {
  language: string;
  title: string;
  description?: string;
  image?: string;
  hidden?: boolean;
  position: number;
}
