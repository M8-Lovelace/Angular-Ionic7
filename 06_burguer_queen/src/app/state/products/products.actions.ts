export class GetProductsByCategory {
  static readonly type = '[Products] Get products by category';
  constructor(public payload: { idCategory: string }) { }
}

export class GetProductById {
  static readonly type = '[Products] Get product by id';
  constructor(public payload: { id: string }) { }
}

