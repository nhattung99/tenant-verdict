# Mock stub for genlayer smart contract SDK to enable local pytest execution
from dataclasses import dataclass

def allow_storage(cls):
    return cls

class Address(str):
    pass

class bigint(int):
    pass

class u256(int):
    pass

class DynArray(list):
    pass

class TreeMap(dict):
    pass

class UserError(Exception):
    pass

class _NondetWeb:
    @staticmethod
    def render(url: str) -> str:
        return f"Mocked Web Content for {url}"

class _Nondet:
    web = _NondetWeb
    @staticmethod
    def exec_prompt(prompt: str) -> str:
        return '{"tenant_refund_pct": 75, "confidence": 90, "reason": "Normal wear and tear on carpets"}'

class _Public:
    @staticmethod
    def write(func):
        return func
    @staticmethod
    def view(func):
        return func

class _Message:
    sender = Address("0x0000000000000000000000000000000000000001")
    value = bigint(1000000000000000000)

class _VM:
    class Return:
        def __init__(self, val):
            self.value = val

    @staticmethod
    def run_nondet(leader_fn, validator_fn):
        res = leader_fn()
        val_ok = validator_fn(_VM.Return(res))
        if not val_ok:
            raise UserError("Validation failed in non-deterministic execution")
        return res

class Contract:
    def __new__(cls, *args, **kwargs):
        instance = super().__new__(cls)
        for attr, attr_type in getattr(cls, "__annotations__", {}).items():
            if not hasattr(instance, attr):
                if attr_type == TreeMap or getattr(attr_type, "__name__", "") == "TreeMap":
                    setattr(instance, attr, TreeMap())
                elif attr_type == DynArray or getattr(attr_type, "__name__", "") == "DynArray":
                    setattr(instance, attr, DynArray())
                elif attr_type == bigint or getattr(attr_type, "__name__", "") == "bigint":
                    setattr(instance, attr, bigint(0))
                elif attr_type == Address or getattr(attr_type, "__name__", "") == "Address":
                    setattr(instance, attr, Address("0x0000000000000000000000000000000000000000"))
        return instance

    def __init__(self):
        pass

class _ContractRef:

    def release_payout(self, dispute_id, tenant, landlord, pct):
        pass
    def record_dispute_result(self, user, winner, pct):
        pass

class _GL:
    Contract = Contract
    public = _Public
    message = _Message
    nondet = _Nondet
    vm = _VM

    @staticmethod
    def get_contract_at(addr: Address):
        return _ContractRef()

    @staticmethod
    def transfer(recipient: Address, value: bigint):
        pass

gl = _GL()
