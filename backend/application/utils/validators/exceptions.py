from abc import ABC, abstractmethod

class BaseValidationException(ABC, Exception):
    @property
    @abstractmethod
    def messages():
        pass


