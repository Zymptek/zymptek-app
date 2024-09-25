export interface Category {
    id: string;
    name: string;
  }
  
  export interface Attribute {
    id: string;
    attribute_name: string;
    field_type: string;
  }
  
  export interface CategoryWithAttributes extends Category {
    attributes: Attribute[];
  }