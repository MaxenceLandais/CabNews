create table if not exists signals (
  id serial primary key,
  title text not null,
  body text not null,
  sector text not null,
  source_kind text not null,
  created_at timestamptz not null default now()
);

create index if not exists signals_created_at_idx on signals (created_at desc);

insert into signals (title, body, sector, source_kind) values
(
  'Rafale F5 : les lots notifiés ne couvrent pas encore le radar',
  'Selon un industriel de la chaîne FSO, les commandes DGA de cette semaine portent surtout sur avionique et armement. Le radar RBE2-XG resterait dans un lot ultérieur, pas avant 2027. À vérifier auprès de Thales et de la DGA avant d’écrire « génération F5 lancée ».',
  'defense',
  'cadre_industrie'
),
(
  'OAT : deux primary dealers ont réduit leur appétit',
  'Le 3 septembre la couverture restait correcte (2,28×–3,10×) mais le livre aurait été plus concentré. Si la prochaine adjudication du jeudi sort sous 2×, le spread n’est plus un sujet de marché, c’est un sujet politique. Recouper AFT.',
  'public-finance',
  'banque_affaires'
),
(
  'SFR : les 5 000 restants n’ont pas de plan B social écrit',
  'Côté repreneurs, le discours est « 3 000 reprises ». Côté organisations, le compartiment SFR SA (réseau, fonctions support, Outre-mer hors périmètre) n’aurait toujours pas de GPEC opposable. C’est le combustible de la grève du 24.',
  'telecoms',
  'syndicat'
),
(
  'Mistral : le 1 Md€ de CA 2026 est un mix compute, pas de licences modèle',
  'Le contrat Microsoft pèserait l’essentiel de la trajectoire. Un CA « IA générative » minoritaire changerait le papier Série D : ce n’est plus un labo, c’est un loueur de GPU labellisé UE. Demander la ventilation.',
  'ia',
  'analyste'
)
on conflict do nothing;
