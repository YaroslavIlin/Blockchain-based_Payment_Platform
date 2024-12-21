// components/Deposit.tsx
"use client";

import { useState } from "react";
import { ethers } from "ethers";
import { useScaffoldWriteContract } from "~~/hooks/scaffold-eth";

interface DepositProps {
  onDeposit: () => void; // Функция для обновления баланса
}

const Deposit: React.FC<DepositProps> = ({ onDeposit }) => {
  const [amount, setAmount] = useState<string>("");
  const { writeContractAsync, isMining } = useScaffoldWriteContract({
    contractName: "PaymentContract", // Имя контракта
  });

  const handleDeposit = async () => {
    if (amount && parseFloat(amount) > 0) {
      const amountInWei = ethers.parseEther(amount);
      try {
        await writeContractAsync({
          functionName: "deposit", // Имя функции контракта для пополнения
          value: amountInWei, // Указываем сумму депозита в wei
        });
        onDeposit(); // Обновляем баланс после успешного депозита
      } catch (error) {
        console.error("Ошибка при депозите:", error);
      }
    } else {
      alert("Пожалуйста, введите корректную сумму для депозита.");
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-8">
      <h2 className="text-2xl font-bold mb-4">Пополнить баланс контракта</h2>
      <input
        type="text"
        placeholder="Сумма депозита (в ETH)"
        value={amount}
        onChange={e => setAmount(e.target.value)} // Обновляем состояние суммы
        className="w-full p-2 mb-4 text-black rounded-lg"
      />
      <button
        onClick={handleDeposit} // Запуск депозита
        disabled={isMining} // Отключаем кнопку, если процесс в ожидании
        className={`w-full py-2 rounded-lg text-white ${isMining ? "bg-gray-500" : "bg-green-500 hover:bg-green-600"}`}
      >
        {isMining ? "Пополнение..." : "Пополнить баланс"} {/*Текст на кнопке зависит от состояния загрузки*/}
      </button>
    </div>
  );
};

export default Deposit;