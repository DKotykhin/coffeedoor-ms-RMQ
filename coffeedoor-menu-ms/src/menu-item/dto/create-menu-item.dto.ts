export class CreateMenuItemDto {
  language: string;
  title: string;
  description?: string;
  price: string;
  hidden?: boolean;
  position: number;
  menuCategory: {
    id: string;
  };
}
