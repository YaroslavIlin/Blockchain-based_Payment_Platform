import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { useScaffoldWriteContract, useScaffoldReadContract } from "~~/hooks/scaffold-eth";
import PaymentContract from "../../hardhat/artifacts/contracts/PaymentContract.sol/PaymentContract.json"; // Импортируйте ABI вашего контракта

export default function CreatePayment() {
  // Состояния для хранения суммы платежа и адреса получателя
  const [amount, setAmount] = useState<string>("");
  const [recipient, setRecipient] = useState<string>("");
  const [contractBalance, setContractBalance] = useState<string>("0");

  // Хук для записи данных в смарт-контракт
  const { writeContractAsync, isMining } = useScaffoldWriteContract({
    contractName: "PaymentContract", // Имя контракта
  });

  // Хук для чтения данных из контракта
  const { data: balance } = useScaffoldReadContract({
    contractName: "PaymentContract",
    functionName: "getBalance",
  });

  useEffect(() => {
    if (balance) {
      setContractBalance(ethers.formatEther(balance)); // Форматируем баланс в ETH
    }
  }, [balance]);

  // Функция для создания платежа
  const createPayment = async () => {
    if (amount && parseFloat(amount) > 0 && ethers.isAddress(recipient)) {
      const amountInWei = ethers.parseEther(amount); // Конвертируем сумму в wei
      if (parseFloat(contractBalance) >= parseFloat(amount)) {
        // Выполняем транзакцию на создание платежа
        try {
          await writeContractAsync({
            functionName: "pay", // Имя функции контракта для создания платежа
            args: [recipient, amountInWei], // Передаем адрес получателя и сумму
            value: amountInWei, // Указываем сумму, которую нужно отправить
          });
        } catch (error) {
          console.error("Ошибка при создании платежа:", error);
          alert("Произошла ошибка при создании платежа. Пожалуйста, попробуйте еще раз.");
        }
      } else {
        alert("Недостаточно средств на контракте для выполнения платежа."); // Если недостаточно средств
      }
    } else {
      alert("Пожалуйста, введите корректную сумму и адрес получателя."); // Если сумма или адрес некорректны
    }
  };

  return (
    <div className="p-6 bg-gradient-to-r from-teal-400 to-blue-500 text-white rounded-lg shadow-lg mx-auto">
      <h2 className="text-2xl font-bold mb-4">Создать платеж</h2>
      <input
        type="text"
        placeholder="Адрес получателя"
        value={recipient}
        onChange={e => setRecipient(e.target.value)} // Обновляем состояние адреса получателя
        className="w-full p-2 mb-4 text-white rounded-lg"
      />
      <input
        type="text"
        placeholder="Сумма платежа (в ETH)"
        value={amount}
        onChange={e => setAmount(e.target.value)} // Обновляем состояние суммы
        className="w-full p-2 mb-4 text-white rounded-lg"
      />
      <button
        onClick={createPayment} // Запуск создания платежа
        disabled={isMining} // Отключаем кнопку, если процесс в ожидании
        className={`w-full py-2 rounded-lg text-white ${isMining ? "bg-gray-500" : "bg-blue-500 hover:bg-blue-600"}`}
      >
        {isMining ? "Создание..." : "Создать платеж"} {/*Текст на кнопке зависит от состояния загрузки*/}
      </button>
      <p className="mt-4">Баланс контракта: {contractBalance} ETH</p> {/* Отображаем баланс контракта */}
   </div>
  )
}