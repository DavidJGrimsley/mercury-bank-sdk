import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { Text, View } from 'react-native';
import { findBestCheckingAccount, type MercuryAccount } from '@mr.dj2u/mercury';
import type { MercuryUiAdapter } from '../adapter';
import { AccountsSelect } from './accounts-select';
import { MercuryLogo } from './mercury-logo';
import { MercuryStatusNotice, type MercuryStatusTone } from './mercury-status-notice';

type MercuryBankOverviewProps = {
  adapter: Pick<MercuryUiAdapter, 'listAccounts'>;
  subtitle?: string;
  footer?: ReactNode;
};

type StatusNotice = {
  message: string;
  tone: MercuryStatusTone;
};

type RecordValue = Record<string, unknown>;

function asRecord(input: unknown): RecordValue | null {
  if (!input || typeof input !== 'object' || Array.isArray(input)) {
    return null;
  }

  return input as RecordValue;
}

function formatMoney(value: unknown): string {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value.toLocaleString(undefined, { style: 'currency', currency: 'USD' });
  }

  if (typeof value === 'string' && value.trim()) {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) {
      return parsed.toLocaleString(undefined, { style: 'currency', currency: 'USD' });
    }
  }

  return 'n/a';
}

export function MercuryBankOverview({
  adapter,
  subtitle = 'Mercury account context for invoice routing.',
  footer,
}: MercuryBankOverviewProps) {
  const [accounts, setAccounts] = useState<MercuryAccount[]>([]);
  const [selectedAccountId, setSelectedAccountId] = useState<string | null>(null);
  const [status, setStatus] = useState<StatusNotice>({
    message: 'Loading Mercury accounts...',
    tone: 'neutral',
  });

  const selectedAccount = useMemo(() => {
    if (accounts.length === 0) {
      return null;
    }

    if (selectedAccountId) {
      const directMatch =
        accounts.find((account) => `${account.id ?? ''}` === `${selectedAccountId}`) ?? null;
      if (directMatch) {
        return directMatch;
      }
    }

    return findBestCheckingAccount(accounts) ?? accounts[0] ?? null;
  }, [accounts, selectedAccountId]);

  useEffect(() => {
    let active = true;

    async function loadAccounts(): Promise<void> {
      if (!adapter.listAccounts) {
        setStatus({
          message: 'Mercury account loading is unavailable because no listAccounts adapter was provided.',
          tone: 'error',
        });
        return;
      }

      setStatus({ message: 'Loading Mercury accounts...', tone: 'neutral' });

      try {
        const rows = await adapter.listAccounts();
        if (!active) {
          return;
        }

        setAccounts(rows);
        const defaultAccount = findBestCheckingAccount(rows) ?? rows[0] ?? null;
        setSelectedAccountId(defaultAccount?.id ? `${defaultAccount.id}` : null);
        setStatus({
          message: rows.length > 0 ? 'Mercury accounts synced.' : 'No Mercury accounts found.',
          tone: rows.length > 0 ? 'success' : 'error',
        });
      } catch (error: unknown) {
        if (!active) {
          return;
        }

        setStatus({
          message: error instanceof Error ? error.message : 'Failed to load Mercury accounts.',
          tone: 'error',
        });
      }
    }

    loadAccounts().catch(() => undefined);

    return () => {
      active = false;
    };
  }, [adapter]);

  const balances = asRecord(selectedAccount?.balances ?? null);
  const available = balances?.available ?? balances?.availableBalance ?? selectedAccount?.availableBalance;
  const current = balances?.current ?? balances?.currentBalance ?? selectedAccount?.currentBalance;

  return (
    <View
      style={{
        gap: 16,
        borderRadius: 24,
        borderWidth: 1,
        borderColor: '#314233',
        backgroundColor: '#0f1711',
        padding: 20,
      }}
    >
      <View style={{ gap: 8 }}>
        <MercuryLogo variant="horizontal" size={280} />
        <Text style={{ color: '#d4e0d0', fontSize: 14 }}>{subtitle}</Text>
      </View>

      {accounts.length > 0 ? (
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            gap: 16,
            flexWrap: 'wrap',
          }}
        >
          <Text style={{ color: '#d4e0d0', fontSize: 14, fontWeight: '700' }}>Account overview</Text>
          <AccountsSelect
            accounts={accounts}
            selectedAccountId={selectedAccountId}
            onSelect={setSelectedAccountId}
            variant="dropdown"
            hideLabel
            dropdownWidth={320}
          />
        </View>
      ) : (
        <MercuryStatusNotice message={status.message} tone={status.tone} />
      )}

      {!selectedAccount ? (
        <Text style={{ color: '#d4e0d0', fontSize: 14 }}>No account data available.</Text>
      ) : (
        <View style={{ gap: 8, borderRadius: 16, borderWidth: 1, borderColor: '#2f4333', padding: 16 }}>
          <Text style={{ color: '#f4fff4', fontSize: 17, fontWeight: '700' }}>
            {selectedAccount.nickname ?? selectedAccount.name ?? 'Mercury account'}
          </Text>
          <Text style={{ color: '#d4e0d0', fontSize: 14 }}>Account ID: {`${selectedAccount.id ?? 'n/a'}`}</Text>
          <Text style={{ color: '#d4e0d0', fontSize: 14 }}>Available: {formatMoney(available)}</Text>
          <Text style={{ color: '#d4e0d0', fontSize: 14 }}>Current: {formatMoney(current)}</Text>
        </View>
      )}

      {footer}
    </View>
  );
}
