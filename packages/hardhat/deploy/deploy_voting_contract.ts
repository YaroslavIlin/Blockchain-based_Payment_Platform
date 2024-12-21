import { HardhatRuntimeEnvironment } from "hardhat/types"; // Импорт типов для среды выполнения Hardhat
import { DeployFunction } from "hardhat-deploy/types"; // Импорт типа функции деплоя
import { PaymentContract } from "../typechain-types"; // Импорт типов сгенерированного контракта

/**
 * Скрипт для деплоя смарт-контракта PaymentContract.
 * Использует Hardhat Runtime Environment для доступа к необходимым функциям и данным.
 *
 * @param hre Объект среды выполнения Hardhat.
 */
const deployPaymentContract: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  // Извлечение имени учетной записи для деплоя
  const { deployer } = await hre.getNamedAccounts();
  // Получение функции для развертывания контрактов
  const { deploy } = hre.deployments;

  // Развертывание контракта PaymentContract
  await deploy("PaymentContract", {
    from: deployer, // Учетная запись, которая развертывает контракт
    args: [], // Аргументы конструктора контракта (в данном случае отсутствуют)
    log: true, // Включение логирования процесса развертывания
    autoMine: true, // Автоматическое майнинг транзакции на локальной сети
  });

  // Получение экземпляра развернутого контракта
  const paymentContract = await hre.ethers.getContract<PaymentContract>("PaymentContract", deployer);

  // Проверка успешного развертывания контракта через вызов метода getBalance()
  console.log("👋 Contract deployed at:", paymentContract.address);
  console.log("👋 Initial balance:", await paymentContract.getBalance());
};

// Экспорт функции для использования в командах Hardhat
export default deployPaymentContract;

// Присвоение тега для удобного выбора скрипта при выполнении
deployPaymentContract.tags = ["PaymentContract"];