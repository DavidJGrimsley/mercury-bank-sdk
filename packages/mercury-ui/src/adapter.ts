import type {
  MercuryAccount,
  MercuryInvoicePayload,
  MercuryInvoiceResponse,
  MercuryRecipient,
  MercurySendMoneyInput,
  MercuryTransaction,
} from '@mr.dj2u/mercury';

export type MercuryUiAdapter = {
  listAccounts?: () => Promise<MercuryAccount[]>;
  listRecipients?: () => Promise<MercuryRecipient[]>;
  listInvoices?: () => Promise<MercuryInvoiceResponse[]>;
  createInvoice?: (payload: MercuryInvoicePayload) => Promise<MercuryInvoiceResponse>;
  sendMoney?: (accountId: string, input: MercurySendMoneyInput) => Promise<MercuryTransaction>;
};

