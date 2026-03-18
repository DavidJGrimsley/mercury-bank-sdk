import { Picker } from '@react-native-picker/picker';
import { useEffect, useMemo, useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';
import type { MercuryCustomerContact, MercuryCustomerContactAdapter } from '../adapter';
import { MercuryLogo } from './mercury-logo';
import { MercuryStatusNotice, type MercuryStatusTone } from './mercury-status-notice';

type MercuryCustomerContactPanelProps = {
  adapter: MercuryCustomerContactAdapter;
  visible?: boolean;
  onError?: (message: string) => void;
};

type StatusState = {
  message: string;
  tone: MercuryStatusTone;
};

function toNullableTrimmed(value: string): string | null {
  const trimmed = value.trim();
  return trimmed ? trimmed : null;
}

const EMPTY_PICKER_VALUE = '';

export function MercuryCustomerContactPanel({
  adapter,
  visible = true,
  onError,
}: MercuryCustomerContactPanelProps) {
  const [customers, setCustomers] = useState<MercuryCustomerContact[]>([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [status, setStatus] = useState<StatusState>({
    message:
      'Keep the local invoice contact current here. Mercury customer sync requires a customer email and Accounts Receivable access.',
    tone: 'neutral',
  });

  const selectedCustomer = useMemo(
    () => customers.find((customer) => customer.id === selectedCustomerId) ?? null,
    [customers, selectedCustomerId],
  );

  useEffect(() => {
    if (!visible) {
      return;
    }

    let active = true;

    async function loadCustomers(): Promise<void> {
      setIsLoading(true);
      try {
        const rows = await adapter.loadCustomers();
        if (!active) {
          return;
        }

        setCustomers(rows);
        setSelectedCustomerId((current) => {
          if (current && rows.some((row) => row.id === current)) {
            return current;
          }
          return rows[0]?.id ?? null;
        });
      } catch (error: unknown) {
        if (!active) {
          return;
        }

        const message = error instanceof Error ? error.message : 'Failed to load customers.';
        onError?.(message);
        setStatus({ message, tone: 'error' });
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    }

    loadCustomers().catch(() => undefined);

    return () => {
      active = false;
    };
  }, [adapter, onError, visible]);

  useEffect(() => {
    if (!selectedCustomer) {
      setCustomerName('');
      setCustomerPhone('');
      setCustomerEmail('');
      return;
    }

    setCustomerName(selectedCustomer.name);
    setCustomerPhone(selectedCustomer.phone ?? '');
    setCustomerEmail(selectedCustomer.email ?? '');
  }, [selectedCustomer]);

  async function refreshCustomers(preferredCustomerId?: string | null): Promise<void> {
    const rows = await adapter.loadCustomers();
    setCustomers(rows);
    setSelectedCustomerId((current) => {
      if (preferredCustomerId && rows.some((row) => row.id === preferredCustomerId)) {
        return preferredCustomerId;
      }
      if (current && rows.some((row) => row.id === current)) {
        return current;
      }
      return rows[0]?.id ?? null;
    });
  }

  async function saveCustomerContact(): Promise<MercuryCustomerContact> {
    if (!selectedCustomerId) {
      throw new Error('Select a customer to update.');
    }

    const trimmedCustomerName = customerName.trim();
    if (!trimmedCustomerName) {
      throw new Error('Customer company/name is required.');
    }

    const payload = {
      id: selectedCustomerId,
      name: trimmedCustomerName,
      phone: toNullableTrimmed(customerPhone),
      email: toNullableTrimmed(customerEmail),
    } satisfies MercuryCustomerContact;

    await adapter.saveCustomerContact(payload);
    await refreshCustomers(selectedCustomerId);
    return payload;
  }

  async function handleSaveContact(): Promise<void> {
    setStatus({ message: 'Saving customer contact...', tone: 'neutral' });
    setIsSaving(true);
    try {
      await saveCustomerContact();
      setStatus({ message: 'Customer contact saved locally.', tone: 'success' });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to save customer contact.';
      onError?.(message);
      setStatus({ message, tone: 'error' });
    } finally {
      setIsSaving(false);
    }
  }

  async function handleSyncCustomer(): Promise<void> {
    if (!adapter.syncCustomerToMercury) {
      return;
    }

    if (!selectedCustomerId) {
      const message = 'Select a customer before syncing.';
      onError?.(message);
      setStatus({ message, tone: 'error' });
      return;
    }

    if (!customerEmail.trim()) {
      const message = 'Add a customer email before syncing the Mercury customer.';
      onError?.(message);
      setStatus({ message, tone: 'error' });
      return;
    }

    setIsSyncing(true);
    setStatus({ message: 'Saving customer contact and syncing to Mercury...', tone: 'neutral' });

    try {
      const payload = await saveCustomerContact();
      await adapter.syncCustomerToMercury(payload);
      setStatus({
        message: `Customer contact saved and Mercury customer synced for ${payload.name}.`,
        tone: 'success',
      });
    } catch (error: unknown) {
      const fallbackMessage =
        error instanceof Error ? error.message : 'Mercury customer sync failed.';
      const message = adapter.formatSyncError?.(error) ?? fallbackMessage;
      onError?.(message);
      setStatus({ message, tone: 'error' });
    } finally {
      setIsSyncing(false);
    }
  }

  if (!visible) {
    return null;
  }

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
        <MercuryLogo variant="horizontal" size={220} />
        <Text style={{ color: '#f4fff4', fontSize: 24, fontWeight: '800' }}>Customer Contact</Text>
        <Text style={{ color: '#d4e0d0', fontSize: 14, lineHeight: 20 }}>
          Update the invoice contact details you want your app to use, then sync that customer to Mercury when AR access is available.
        </Text>
      </View>

      <View
        style={{
          gap: 8,
          borderWidth: 1,
          borderColor: '#d4b568',
          borderRadius: 14,
          backgroundColor: '#fff8e6',
          paddingHorizontal: 12,
          paddingVertical: 10,
        }}
      >
        <Text style={{ color: '#6b4e00', fontWeight: '700' }}>Customer sync guardrails</Text>
        <Text style={{ color: '#6b4e00', fontSize: 12, lineHeight: 18 }}>
          Saving here always updates the local app customer. Mercury customer sync still needs a customer email and Accounts Receivable access, so sandbox banking access alone will not create AR customers.
        </Text>
      </View>

      {customers.length === 0 ? (
        <Text style={{ color: '#d4e0d0', fontSize: 14 }}>
          {isLoading ? 'Loading customers...' : 'No customers available yet.'}
        </Text>
      ) : (
        <>
          <View
            style={{
              borderRadius: 12,
              borderWidth: 1,
              borderColor: '#314233',
              backgroundColor: '#111911',
              overflow: 'hidden',
            }}
          >
            <Picker
              selectedValue={selectedCustomerId ?? EMPTY_PICKER_VALUE}
              onValueChange={(value) => {
                const next = String(value ?? EMPTY_PICKER_VALUE);
                setSelectedCustomerId(next || null);
              }}
              dropdownIconColor="#f4fff4"
              style={{ color: '#f4fff4', backgroundColor: '#111911' }}
            >
              <Picker.Item
                label="Select customer"
                value={EMPTY_PICKER_VALUE}
                color="#9eb39f"
                style={{ color: '#9eb39f', backgroundColor: '#111911' }}
              />
              {customers.map((customer) => (
                <Picker.Item
                  key={customer.id}
                  label={customer.name}
                  value={customer.id}
                  color="#f4fff4"
                  style={{ color: '#f4fff4', backgroundColor: '#111911' }}
                />
              ))}
            </Picker>
          </View>

          <TextInput
            value={customerName}
            onChangeText={setCustomerName}
            placeholder="Customer company/name"
            placeholderTextColor="#9eb39f"
            style={inputStyle}
          />
          <TextInput
            value={customerPhone}
            onChangeText={setCustomerPhone}
            placeholder="Customer phone"
            placeholderTextColor="#9eb39f"
            keyboardType="phone-pad"
            style={inputStyle}
          />
          <TextInput
            value={customerEmail}
            onChangeText={setCustomerEmail}
            placeholder="Customer email"
            placeholderTextColor="#9eb39f"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            style={inputStyle}
          />

          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
            <Pressable
              onPress={() => {
                handleSaveContact().catch(() => undefined);
              }}
              disabled={isSaving || isSyncing || isLoading || !selectedCustomerId}
              style={primaryButtonStyle}
            >
              <Text style={primaryButtonTextStyle}>{isSaving ? 'Saving...' : 'Save Contact'}</Text>
            </Pressable>
            {adapter.syncCustomerToMercury ? (
              <Pressable
                onPress={() => {
                  handleSyncCustomer().catch(() => undefined);
                }}
                disabled={isSaving || isSyncing || isLoading || !selectedCustomerId}
                style={secondaryButtonStyle}
              >
                <Text style={secondaryButtonTextStyle}>
                  {isSyncing ? 'Syncing...' : 'Sync Customer to Mercury'}
                </Text>
              </Pressable>
            ) : null}
          </View>
        </>
      )}

      <MercuryStatusNotice message={status.message} tone={status.tone} />
    </View>
  );
}

const inputStyle = {
  borderRadius: 14,
  borderWidth: 1,
  borderColor: '#314233',
  backgroundColor: '#111911',
  color: '#f4fff4',
  paddingHorizontal: 12,
  paddingVertical: 10,
};

const primaryButtonStyle = {
  borderRadius: 16,
  backgroundColor: '#3b7bd0',
  paddingVertical: 12,
  paddingHorizontal: 18,
  alignItems: 'center' as const,
};

const primaryButtonTextStyle = {
  color: '#ffffff',
  fontWeight: '700' as const,
};

const secondaryButtonStyle = {
  borderRadius: 16,
  borderWidth: 1,
  borderColor: '#456049',
  backgroundColor: '#111911',
  paddingVertical: 12,
  paddingHorizontal: 18,
  alignItems: 'center' as const,
};

const secondaryButtonTextStyle = {
  color: '#f4fff4',
  fontWeight: '700' as const,
};
