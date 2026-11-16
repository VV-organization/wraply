/** Fail closed until named provider contracts, server sessions and a durable ledger are connected. */
export function unavailablePurchase(){return {status:409,body:{code:"INTEGRATION_UNAVAILABLE",error:"Оплата пока недоступна. Выбранные предметы сохранены в корзине."}} as const;}
export function unavailableTopup(kind:"balance"|"steam"){return {status:409,body:{code:"INTEGRATION_UNAVAILABLE",error:kind==="steam"?"Оплата пополнения Steam пока недоступна.":"Платёжный сервис пока не подключён."}} as const;}
