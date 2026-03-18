import { Picker } from '@react-native-picker/picker';
import { Pressable, Text, View } from 'react-native';
import type { MercuryAccount } from '@mr.dj2u/mercury';
import { MercuryBadge } from './mercury-badge';
import { mercuryUiTheme } from '../theme';

type AccountsSelectProps = {
  accounts: MercuryAccount[];
  selectedAccountId?: string | null;
  onSelect: (accountId: string) => void;
  label?: string;
  variant?: 'cards' | 'dropdown';
};

function resolveAccountId(account: MercuryAccount): string {
  return `${account.id ?? account.name ?? 'account_unknown'}`;
}

function formatAccountLabel(account: MercuryAccount): string {
  const label = account.nickname ?? account.name ?? 'Mercury account';
  const rawLast4 =
    typeof account.numberLast4 === 'string'
      ? account.numberLast4
      : typeof account.accountNumberLast4 === 'string'
        ? account.accountNumberLast4
        : null;

  return rawLast4 ? `${label} ..${rawLast4}` : label;
}

export function AccountsSelect({
  accounts,
  selectedAccountId,
  onSelect,
  label = 'Destination account',
  variant = 'cards',
}: AccountsSelectProps) {
  if (variant === 'dropdown') {
    return (
      <View style={{ gap: 8 }}>
        <Text style={{ color: mercuryUiTheme.colors.text, fontSize: 13, fontWeight: '700' }}>
          {label}
        </Text>
        <View
          style={{
            borderWidth: 1,
            borderColor: mercuryUiTheme.colors.border,
            borderRadius: 14,
            backgroundColor: mercuryUiTheme.colors.surface,
            overflow: 'hidden',
          }}
        >
          <Picker
            selectedValue={selectedAccountId ?? (accounts[0] ? resolveAccountId(accounts[0]) : '')}
            onValueChange={(value) => onSelect(String(value))}
            dropdownIconColor={mercuryUiTheme.colors.text}
            style={{ color: mercuryUiTheme.colors.text, backgroundColor: mercuryUiTheme.colors.surface }}
          >
            {accounts.map((account) => {
              const accountId = resolveAccountId(account);
              return (
                <Picker.Item
                  key={accountId}
                  label={formatAccountLabel(account)}
                  value={accountId}
                  color={mercuryUiTheme.colors.text}
                  style={{
                    color: mercuryUiTheme.colors.text,
                    backgroundColor: mercuryUiTheme.colors.surface,
                  }}
                />
              );
            })}
          </Picker>
        </View>
      </View>
    );
  }

  return (
    <View style={{ gap: 8 }}>
      <Text style={{ color: mercuryUiTheme.colors.text, fontSize: 13, fontWeight: '700' }}>
        {label}
      </Text>
      <View style={{ gap: 8 }}>
        {accounts.map((account) => {
          const accountId = resolveAccountId(account);
          const active = accountId === selectedAccountId;

          return (
            <Pressable
              key={accountId}
              onPress={() => onSelect(accountId)}
              style={{
                borderWidth: 1,
                borderColor: active ? mercuryUiTheme.colors.accent : mercuryUiTheme.colors.border,
                borderRadius: 16,
                backgroundColor: active ? mercuryUiTheme.colors.accentSoft : mercuryUiTheme.colors.surface,
                padding: 12,
                gap: 4,
              }}
            >
              <Text style={{ color: mercuryUiTheme.colors.text, fontWeight: '700' }}>
                {formatAccountLabel(account)}
              </Text>
              <Text style={{ color: mercuryUiTheme.colors.mutedText, fontSize: 12 }}>
                {accountId}
              </Text>
              {active ? <MercuryBadge label="Selected" tone="accent" /> : null}
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

