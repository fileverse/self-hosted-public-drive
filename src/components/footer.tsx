const Footer = () => {
  return (
    <div className="fixed bottom-10 mx-auto max-h-[200px] bg-[#F8F9FA] overflow-y-auto max-w-[768px] w-full text-sm text-gray-500">
      <span>
        This{' '}
        <a
          style={{ color: 'blue' }}
          href="https://github.com/fileverse/self-hosted-public-drive"
          target="_blank"
          rel="noopener noreferrer"
        >
          repository
        </a>{' '}
        is experimental and focuses on a self-hosted approach to non-encrypted
        file management using peer-to-peer networks, decentralized ID, and
        public blockchains. This version uses by default the The InterPlanetary
        File System (IPFS), smart contracts on Gnosis Chain, and Pimlico
        paymasters for account abstraction. You can run and maintain your public
        drive by using other networks and middleware. This repository follows a
        GNU GPL v3 license and its authors are not responsible for any
        warranties regarding the software, meaning they are not obligated to
        provide any guarantees or support, nor can they be held liable for
        damages caused by the software.
      </span>
    </div>
  )
}

export { Footer }
