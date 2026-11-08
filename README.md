# Billes

Le solitaire en croix, le casse-tête de billes sur un plateau troué : à chaque coup, une bille saute par-dessus sa voisine et la fait sortir. Il faut finir avec une seule bille, et au centre pour une partie parfaite.

*English version: [README.en.md](README.en.md)*

## Comment jouer

1. Clique sur une bille : elle se soulève, et les trous où elle peut arriver s'allument en jaune.
2. Clique sur un de ces trous : la bille saute en ligne droite (horizontale ou verticale, jamais en diagonale) par-dessus sa voisine, et la bille sautée sort du plateau.
3. La partie s'arrête quand plus aucun saut n'est possible.

- **Retour** ou **Ctrl+Z** annule le dernier saut, sans limite : on apprend en revenant en arrière, même après la fin de la partie.
- En haut, le compteur montre les billes restantes et le nombre de sauts encore possibles.
- **Nouvelle partie** remet le plateau à zéro ; un clic après la fin relance aussi.

## Les plateaux

Choisis-le dans la liste ; chacun commence avec un seul trou vide.

- **Croix anglaise** : 33 trous, 32 billes, trou vide au centre. Le classique : 4 sauts possibles au départ.
- **Croix française** : 37 trous, 36 billes, avec quatre trous de plus dans les angles de la croix.
- **Petite croix** : 21 billes, pour apprendre.
- **Pyramide** : 15 billes en triangle.

## Fin de partie

- **Parfait : au centre !** : il reste une bille, dans le trou du milieu du plateau.
- **Une seule bille !** : il reste une bille ailleurs.
- **Plus de saut** : il reste plusieurs billes ; le nombre est affiché.

## Statistiques

Le panneau Records montre, pour le plateau choisi, ton **record** (le moins de billes laissées) et tes **réussites** (parties finies avec une seule bille, sur le nombre de parties jouées).

## Données et synchronisation

Tes records par plateau et tes réussites sont enregistrés par NeoDex, sauvegardés et synchronisés entre tes PC si la synchro est activée.

## Installer

Dans NeoDex : **NeoStore → À découvrir → Billes → Installer**.

Développer un plugin : voir le [SDK NeoDex](https://github.com/NDesumeur/neodex-sdk).
