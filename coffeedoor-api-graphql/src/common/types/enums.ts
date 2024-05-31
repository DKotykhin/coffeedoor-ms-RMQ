import { registerEnumType } from '@nestjs/graphql';

export enum LanguageCode {
  UA = 'UA',
  EN = 'EN',
}
registerEnumType(LanguageCode, {
  name: 'LanguageCode',
});

export enum RoleTypes {
  USER = 'USER',
  ADMIN = 'ADMIN',
  SUBADMIN = 'SUBADMIN',
  VISITOR = 'VISITOR',
}
registerEnumType(RoleTypes, {
  name: 'RoleTypes',
});

export enum OrderStatus {
  NEW = 'NEW',
  IN_PROGRESS = 'IN_PROGRESS',
  DONE = 'DONE',
  CANCELED = 'CANCELED',
}
registerEnumType(OrderStatus, {
  name: 'OrderStatus',
});

export enum DeliveryWay {
  DELIVERY = 'DELIVERY',
  PICKUP = 'PICKUP',
}
registerEnumType(DeliveryWay, {
  name: 'DeliveryWay',
});
