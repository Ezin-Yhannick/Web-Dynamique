// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract RegistreDMP {
    address public owner;

    struct Ancrage {
        bool existe;
        string idAuteur;
        uint256 horodatage;
    }

    struct Acces {
        string idDossier;
        string idMedecin;
        string action;
        bool urgence;
        uint256 horodatage;
    }

    mapping(string => Ancrage) private ancrages;
    mapping(string => Acces[]) private journalAcces;

    event DocumentAncre(string empreinte, string idAuteur, uint256 horodatage);
    event AccesJournalise(string idDossier, string idMedecin, string action, bool urgence, uint256 horodatage);

    modifier onlyOwner() {
        require(msg.sender == owner, "Acces non autorise");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function ancrerDocument(string memory _empreinte, string memory _idAuteur) public onlyOwner returns (bool) {
        require(!ancrages[_empreinte].existe, "Document deja ancre");
        ancrages[_empreinte] = Ancrage({
            existe: true,
            idAuteur: _idAuteur,
            horodatage: block.timestamp
        });
        emit DocumentAncre(_empreinte, _idAuteur, block.timestamp);
        return true;
    }

    function verifierAncrage(string memory _empreinte) public view returns (bool existe, string memory idAuteur, uint256 horodatage) {
        Ancrage memory a = ancrages[_empreinte];
        return (a.existe, a.idAuteur, a.horodatage);
    }

    function journaliserAcces(string memory _idDossier, string memory _idMedecin, string memory _action, bool _urgence) public onlyOwner returns (bool) {
        journalAcces[_idDossier].push(Acces({
            idDossier: _idDossier,
            idMedecin: _idMedecin,
            action: _action,
            urgence: _urgence,
            horodatage: block.timestamp
        }));
        emit AccesJournalise(_idDossier, _idMedecin, _action, _urgence, block.timestamp);
        return true;
    }

    function obtenirJournalAcces(string memory _idDossier) public view returns (Acces[] memory) {
        return journalAcces[_idDossier];
    }
}
